class ProjectType < ApplicationRecord

  include ProjectTypes::Geoserver
  include ProjectTypes::Indicators
  include ProjectTypes::Scopes
  include ProjectTypes::Validations
  include ProjectTypes::GeoJson

  has_paper_trail

  require 'rgeo/shapefile'
  require 'rgeo/geo_json'
  require 'json'
  require 'fileutils'
  require 'rgeoserver'
  require 'net/http'
  require 'uri'
  require 'csv'

  has_many :project_fields, dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :dashboards, dependent: :destroy
  has_many :has_project_types, dependent: :destroy
  has_many :users
  has_many :project_statuses, dependent: :destroy
  has_many :project_filters
  has_many :analytics_dashboard, dependent: :destroy
  accepts_nested_attributes_for :project_fields, allow_destroy: true
  accepts_nested_attributes_for :projects, allow_destroy: true

  FILTERS = %w(= < > <= >= != ilike )

  attr_accessor :file, :latitude, :longitude, :address, :department, :province, :country, :data, :type_file, :kind_file

  after_create :create_project_statuses
  after_create :new_dashboard
  after_create :load_file, if: :create_project_is_for_file
  after_create :create_view
  after_destroy :destroy_view
  after_update :destroy_view
  after_update :create_view

  def create_project_is_for_file
    return true if self.kind_file == 'true'
    return false
  end

  def create_project_statuses
    ProjectStatus.create(name: 'Default', color:"#f34c48", project_type_id: self.id, status_type: 'Asignable', priority: 1)
  end

  def new_dashboard
    Dashboard.create(name: "Dashboard_1", project_type_id: self.id )
  end

  def validate_options
    if !self.fields.nil?
      self.fields.each do |field|
        if field.cleasing_data?
          new_field = "new_" + field.name
          @new_project_field =  ProjectField.create(name: new_field, field_type: 'text_field', project_type_id: field.product_type_id)
          @new_project_field.save
        end
      end
    end
  end

  def self.counters(id)
    count = Project.where(project_type_id: id).count
  end

  def create_view

    fields = self.project_fields
    current_tenant = Apartment::Tenant.current
    project_type_id = self.id
    name_layer = self.name_layer
    type_geometry = self.type_geometry

    vv = "CREATE OR REPLACE VIEW #{current_tenant}.#{name_layer} AS "
    vv += " select "
    fields.each do |field|
      if field.key != ''
        if field.key != 'app_estado' && field.key != 'app_usuario' && field.key != 'app_id'
          vv += " properties->>'#{field.key}' as #{field.key}, "
        end
      end
    end
    vv += " users.name as app_usuario, "
    vv += " project_statuses.name as app_estado, "
    vv += " projects.id as app_id, "
    vv += " projects.gwm_created_at, "
    vv += " projects.gwm_updated_at, "
    vv += " projects.row_enabled, "
    vv += " projects.disabled_at, "
    vv += " projects.project_type_id, "
    vv += " shared_extensions.st_y(the_geom),  " if type_geometry != 'Polygon'
    vv += " shared_extensions.st_x(the_geom), "if type_geometry != 'Polygon'
    vv += " project_statuses.color, "
    vv += " the_geom "
    vv += " FROM #{current_tenant}.projects "
    vv += " LEFT OUTER JOIN #{current_tenant}.project_statuses ON projects.project_status_id = project_statuses.id "
    vv += " JOIN public.users ON users.id = projects.user_id "
    vv += " where projects.project_type_id =#{project_type_id} and row_active = true and current_season = true; "
    view = ActiveRecord::Base.connection.execute(vv)
    return
  end

  def destroy_view
    query = "DROP VIEW IF EXISTS #{self.name_layer}"
    ActiveRecord::Base.connection.execute(query)
  end

  def self.save_rows_project_data_childs row, i, project_type_id
    result_hash = {}

    if !row.nil?
      child_data = ProjectDataChild.new()
      project_field_id = 1710
      project = Project.where("properties->>'numero_trampa' = '#{row['trampa']}' and project_type_id = #{project_type_id}").select(:id).first
      if !project.nil?
        child_data[:project_id] = project.id
        value_name = {}
        row.each do |data |
          field = ProjectSubfield.where(key: data[0], project_field_id: project_field_id).first
          if !field.nil?
            value_name.merge!("#{field.id}": data[1] )
          end
        end
        child_data[:properties] = [value_name]
        child_data[:project_field_id] = project_field_id
        child_data.save
      end
    end
  end

  def self.export_geojsonn filter_value, filter_by_column, order_by_column, project_type_id, type_box, size_box, attribute_filters, filtered_form_ids, from_date, to_date, fields, user_id

    require 'rgeo/geo_json'

    data = Project
      .select('DISTINCT main.id, ST_AsGeoJSON(the_geom) as geom')
      .from('projects main')
      .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
      .joins('INNER JOIN public.users ON users.id = main.user_id')
      .where('main.project_type_id = ?', project_type_id.to_i)
      .where('main.row_active = ?', true)
      .where('main.current_season = ?', true)

    # Agrega al select los campos visibles en la tabla
    fields.each do |f|
      data = data.select("main.properties -> '#{f}' AS #{f}")
    end

    # Aplica filtro geográfico
    if !type_box.blank? && !size_box.blank?

      if type_box == 'extent'

        minx = size_box[0].to_f if !size_box.nil?
        miny = size_box[1].to_f if !size_box.nil?
        maxx = size_box[2].to_f if !size_box.nil?
        maxy = size_box[3].to_f if !size_box.nil?
        data = data.where("shared_extensions.ST_Contains(shared_extensions.ST_MakeEnvelope(#{minx}, #{maxy}, #{maxx}, #{miny}, 4326), main.#{:the_geom})")

      else

        # NOTE: Acá el size_box llega diferente al de las demás funciones. Tener en cuenta al unificar.
        arr1 = []
        size_box.each do |x|
          z = []
          x.each do |y|
            @y = y
            z.push(y)
          end
          arr1.push([z])
        end
        data = data.where("shared_extensions.ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'), 4326), main.#{:the_geom})")
      end
    end

    @project_filter = ProjectFilter.where(project_type_id: project_type_id.to_i).where(user_id: user_id).first

    if !@project_filter.nil?

      # Aplica filtro owner
      if @project_filter.owner == true
        data = data.where('main.user_id = ?', user_id)
      end

      # Aplica filtro por atributo a la capa principal
      if !@project_filter.properties.nil?
        @project_filter.properties.to_a.each do |prop|
          data = data.where("main.properties ->> '#{prop[0]}' = '#{prop[1]}'")
        end
      end

      # Aplica filtro intercapa
      if !@project_filter.cross_layer_filter_id.nil?

        @cross_layer_filter = ProjectFilter.where(id: @project_filter.cross_layer_filter_id).where(user_id: user_id).first

        # Cruza la capa principal con la capa secunadaria
        data = data
          .except(:from).from('projects main CROSS JOIN projects sec')
          .where('shared_extensions.ST_Intersects(main.the_geom, sec.the_geom)')
          .where('sec.project_type_id = ?', @cross_layer_filter.project_type_id)
          .where('sec.row_active = ?', true)
          .where('sec.current_season = ?', true)

        # Aplica filtro por owner a la capa secundaria
        if @cross_layer_filter.owner == true
          data = data.where('sec.user_id = ?', user_id)
        end

        # Aplica filtro por atributo a la capa secundaria
        if !@cross_layer_filter.properties.nil?
          @cross_layer_filter.properties.to_a.each do |prop|
            data = data.where("sec.properties->>'#{prop[0]}' = '#{prop[1]}'")
          end
        end
      end
    end

    # Aplica filtro de time_slider
    if !from_date.blank? || !to_date.blank?
      data = data.where("main.gwm_created_at BETWEEN '#{from_date}' AND '#{to_date}'")
    else
      data = data.where('main.row_enabled = ?', true)
    end

    # Aplica filtros generados por el usuario
    if !attribute_filters.blank?

      attribute_filters.each do |key|

        @s = key.split('|')
        @field = @s[0]
        @filter = @s[1]
        @value = @s[2]

        # Aplica filtro por campo usuario
        if @field == 'app_usuario'
          data =  data.where("users.name " + @filter + " '#{@value}'")
        end

        # Aplica filtro por campo estado
        if @field == 'app_estado'
          data =  data.where("project_statuses.name " + @filter + " '#{@value}' ")
        end

        # Aplica filtro por otro campo
        if @field != 'app_usuario' && @field != 'app_estado'
          data = data.where("main.properties->>'" + @field + "'" + @filter + "'#{@value}'")
        end
      end

    end

    # Aplica filtros de hijos
    if !filtered_form_ids.blank?
      final_array = []
      filtered_form_ids.each do |ids_array|
        ids_array = JSON.parse(ids_array)
        if !final_array.blank?
          final_array = final_array & ids_array
        else
          final_array = ids_array
        end
      end
      if final_array.blank?
        final_array.push(-1)
      end
      final_array = final_array.to_s.gsub(/\[/, '(').gsub(/\]/, ')')
      data = data.where("main.id IN #{final_array}")
    end

    # Aplica búsqueda del usuario
    if !filter_by_column.blank? && !filter_value.blank?
      data = data.where("TRANSLATE(main.properties ->> '#{filter_by_column}','ÁÉÍÓÚáéíóú','AEIOUaeiou') ilike translate('%#{filter_value}%','ÁÉÍÓÚáéíóú','AEIOUaeiou')")
    end

    # Aplica órden de los registros
    if !order_by_column.blank?
      field = ProjectField.where(key: order_by_column, project_type_id: project_type_id).first

      # TODO: se deben corregir los errores ortográficos almacenados en la db
      if field.field_type.name == 'Numérico' || field.field_type.name == 'Numerico'
        data = data
          .except(:select).select("DISTINCT main.*, (main.properties ->> '#{order_by_column}')::numeric AS order")
          .order("(main.properties ->> '#{order_by_column}')::numeric")
      elsif field.field_type.name == 'Fecha'
        data = data
          .except(:select).select("DISTINCT main.*, (main.properties ->> '#{order_by_column}')::date AS order")
          .order("(main.properties ->> '#{order_by_column}')::date")
      else
        data = data
          .except(:select).select("DISTINCT main.*, main.properties ->> '#{order_by_column}' AS order")
          .order("main.properties ->> '#{order_by_column}'")
      end
    else
      data = data.order("main.id")
    end

    file = {
      'type': 'FeatureCollection',
      'features': []
    }

    # Guardamos el resultado de la consulta en un array
    data_array = data.map(&:attributes)

    data_array.each do |row|

      # Extraemos id y geom y las eliminamos del hash
      id = row['id']
      geom = JSON.parse(row['geom'])
      row.delete('id')
      row.delete('geom')

      # Armamos el feature y lo agregamos al archivo
      feature = {
        'type': 'Feature',
        'id': id,
        'geometry': geom,
        'properties': row.compact
      }
      file[:features] << feature

    end
    return file
  end

end
