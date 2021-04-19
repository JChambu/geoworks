class Project < ApplicationRecord
  has_paper_trail
  include Projects::Scopes

  require "json"
  belongs_to :project_status
  belongs_to :project_type
  belongs_to :user
  has_many :project_data_child
  before_update :update_sequence_projects

  #validate :validate_properties

  def self.geometry_bounds project_type_id, user_id, attribute_filters, filtered_form_ids, from_date, to_date

    @bounds = Project
      .select("
        shared_extensions.st_Xmin(shared_extensions.st_collect(main.the_geom)) as minx,
        shared_extensions.st_Ymin(shared_extensions.st_collect(main.the_geom)) as miny,
        shared_extensions.st_Xmax(shared_extensions.st_collect(main.the_geom)) as maxx,
        shared_extensions.st_Ymax(shared_extensions.st_collect(main.the_geom)) as maxy
      ")
      .from('projects main')
      .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
      .joins('INNER JOIN public.users ON users.id = main.user_id')
      .where('main.project_type_id = ?', project_type_id)
      .where('main.row_active = ?', true)
      .where('main.current_season = ?', true)

    @project_filter = ProjectFilter.where(project_type_id: project_type_id.to_i).where(user_id: user_id).first

    if !@project_filter.nil?

      # Aplica filtro owner
      if @project_filter.owner == true
        @bounds = @bounds.where('main.user_id = ?', user_id)
      end

      # Aplica filtro por atributo a la capa principal
      if !@project_filter.properties.nil?
        @project_filter.properties.to_a.each do |prop|
          @bounds = @bounds.where("main.properties ->> '#{prop[0]}' = '#{prop[1]}'")
        end
      end

      # Aplica filtro intercapa
      if !@project_filter.cross_layer_filter_id.nil?

        @cross_layer_filter = ProjectFilter.where(id: @project_filter.cross_layer_filter_id).where(user_id: user_id).first

        # Cruza la capa principal con la capa secunadaria
        @bounds = @bounds
          .except(:from).from('projects main CROSS JOIN projects sec')
          .where('shared_extensions.ST_Intersects(main.the_geom, sec.the_geom)')
          .where('sec.project_type_id = ?', @cross_layer_filter.project_type_id)
          .where('sec.row_active = ?', true)
          .where('sec.current_season = ?', true)

        # Aplica filtro por owner a la capa secundaria
        if @cross_layer_filter.owner == true
          @bounds = @bounds.where('sec.user_id = ?', user_id)
        end

        # Aplica filtro por atributo a la capa secundaria
        if !@cross_layer_filter.properties.nil?
          @cross_layer_filter.properties.to_a.each do |prop|
            @bounds = @bounds.where("sec.properties->>'#{prop[0]}' = '#{prop[1]}'")
          end
        end
      end
    end

    # Aplica filtro de time_slider
    if !from_date.blank? || !to_date.blank?
      @bounds = @bounds.where("main.gwm_created_at BETWEEN '#{from_date}' AND '#{to_date}'")
    else
      @bounds = @bounds.where('main.row_enabled = ?', true)
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
      final_array = final_array.to_s.gsub(/\[/, '(').gsub(/\]/, ')')
      @bounds = @bounds.where("main.id IN #{final_array}")
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
          @bounds = @bounds.where("users.name " + @filter + " '#{@value}'")
        end

        # Aplica filtro por campo estado
        if @field == 'app_estado'
          @bounds = @bounds.where("project_statuses.name " + @filter + " '#{@value}' ")
        end

        # Aplica filtro por otro campo
        if @field != 'app_usuario' && @field != 'app_estado'
          @bounds = @bounds.where("main.properties->>'" + @field + "'" + @filter + "'#{@value}'")
        end
      end
    end

    @bounds
  end

  def validate_properties

    if !project_type.fields.nil?
      project_type.fields.each do |field|
        if field.required? && properties[field.name].blank?
          errors.add field.name, "must not be blank"
        end
        if field.cleasing_data?
          new_field = "new_" + field.name
          reg = RegexpType.find(field.regexp_type_id)
          regexp_type = /#{reg.expresion}/
          data_field = properties[field.name]
          regexp_data = regexp_type.match(data_field)
          self.properties[new_field] = regexp_data[1] if !regexp_data.nil?
        end
      end
    end
  end

  def self.to_csv

    attributes = ProjectField.where(project_type_id: 6).select(:name)

    @at = []
    attributes.each do |a|
      @at << a.name
    end

    CSV.generate(headers: true) do |csv|
      csv << @at
      @all = all
      all.each do |product|
        p product
        csv << @at.map { |attr|  product.send(attr) }
      end
    end
  end

  def self.properties_field

    @fields = ProjectField.where(project_type_id: 31)
    @properties = Project.where(project_type_id: 32).select("properties->>'form_values'")

  end

  def update_sequence_projects
    sequence_name = 'projects_update_sequence_seq'
    @a = ActiveRecord::Base.connection.execute("SELECT nextval('#{sequence_name}')")
    self.update_sequence = @a[0]['nextval']
  end

  def change_owner user_id
    self.properties['app_usuario'] = user_id
    self.user_id = user_id
    save!
  end

  def disable_form
    self.row_enabled = false
    self.disabled_at = Time.now - 3.hours # TODO: Corregir zona horaria
    save!
  end

  def update_form properties

    attributes = {
      properties: properties,
      gwm_updated_at: Time.now - 3.hours # TODO: Corregir zona horaria
    }
    self.update_attributes(attributes)

  end

end
