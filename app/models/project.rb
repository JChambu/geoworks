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

  def destroy_form
    self.row_active = false
    save!
  end

  def change_status status_id
    self.properties['app_estado'] = status_id
    self.project_status_id = status_id
    self.gwm_updated_at = Time.zone.now
    save!
    update_inheritable_statuses
  end

  def disable_form
    self.row_enabled = false
    self.disabled_at = Time.zone.now
    save!
  end

  def update_form properties
    properties.each do |key, value|
      self.properties[key] = value
    end
    self.gwm_updated_at = Time.zone.now
    save!
  end

  def update_geom_and_calculated_fields new_geom, new_properties
    new_properties.each do |key, value|
      self.properties[key] = value
    end
    self.the_geom = new_geom
    self.gwm_updated_at = Time.now
    save!
  end

  def self.filter_equal_records_with_timer timer

    case timer
    when 'Semana'
      where("extract(week from small_geom.gwm_created_at) = ?", Date.today.cweek)
    when 'Mes'
      where("extract(month from small_geom.gwm_created_at) = ?", Date.today.month)
    when 'Año'
      where("extract(year from small_geom.gwm_created_at) = ?", Date.today.year)
    when 'No'
      where.not("small_geom.id": nil) # Omite el where con una clause que siempre se va a cumplir
    end

  end

  def update_inheritable_statuses

    # Busca los estados heredables ordenados por level y prioridad
    statuses = ProjectStatus
      .joins("INNER JOIN project_types ON project_types.id = project_statuses.project_type_id")
      .where(status_type: "Heredable")
      .order("project_types.level ASC")
      .order(priority: :desc)

    @projects_to_update_hash = {}

    # Cicla los estados heredados
    statuses.each do |status|

      # Busca los registros de big_geom a los que se les debe modificarles el estado
      projects_to_update = Project
        .select("big_geom.*")
        .from("projects AS big_geom, projects AS small_geom")
        .where("shared_extensions.ST_Contains(big_geom.the_geom, small_geom.the_geom)")
        .where("big_geom.project_type_id = ?", status.project_type_id)
        .where("small_geom.project_type_id = ?", status.inherit_project_type_id)
        .where("small_geom.project_status_id = ?", status.inherit_status_id)
        .where("small_geom.row_active = true")
        .where("small_geom.current_season = true")
        .where("big_geom.row_active = true")
        .where("big_geom.current_season = true")
        .filter_equal_records_with_timer(status.timer)
        .uniq

      if !projects_to_update.empty?
        projects_to_update.each do |p|
          @projects_to_update_hash[p.id] = status.id
        end
      end

    end # cierra each status

    @projects_to_update_hash.each do |project_id, status_id|

      project = Project.find_by(id: project_id)

      if project.project_status_id != status_id
        project.project_status_id = status_id
        project.save
      end

    end

  end # Cierra update_inheritable_statuses

end
