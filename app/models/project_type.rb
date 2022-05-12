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
  has_many :users, through: :has_project_types
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
    ProjectStatus.create(name: ProjectStatus::DEFAULT_NAME, color:"#f34c48", project_type_id: self.id, status_type: 'Asignable', priority: 1)
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

  def self.export_geojsonn filter_value, filter_by_column, order_by_column, project_type_id, type_box, size_box, attribute_filters, filtered_form_ids, from_date, to_date, fields, user_id, intersect_width_layers, active_layers, filters_layers, timeslider_layers

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

    puts "size box que llega a gejsonn"
    puts size_box

    data = ProjectTypesController.set_map_filter data, type_box, size_box
    @project_filter = ProjectFilter.where(project_type_id: project_type_id.to_i).where(user_id: user_id).first
    data = ProjectTypesController.set_project_filter data, @project_filter
    data = ProjectTypesController.set_time_slider data, from_date, to_date
    data = ProjectTypesController.set_filters_on_the_fly data, attribute_filters
    data = ProjectTypesController.set_filtered_form_ids data, filtered_form_ids
    data = ProjectTypesController.set_intersect_width_layers data, intersect_width_layers, active_layers, filters_layers, timeslider_layers

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
          .select("(main.properties ->> '#{order_by_column}')::numeric AS order")
          .order("(main.properties ->> '#{order_by_column}')::numeric")
      elsif field.field_type.name == 'Fecha'
        data = data
          .select(" to_date(main.properties ->> '#{order_by_column}','DD/MM/YYYY') AS order")
          .order("to_date(main.properties ->> '#{order_by_column}','DD/MM/YYYY')")
      else
        data = data
          .select("main.properties ->> '#{order_by_column}' AS order")
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

    puts "Data Array"
    puts data_array

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
