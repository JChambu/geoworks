class Project < ApplicationRecord
  has_paper_trail

  include Projects::Scopes

  require "json"
  belongs_to :project_status
  belongs_to :project_type
  belongs_to :user
  has_many :project_data_child
  has_many :project_status_rules

  before_update :update_sequence_projects
  after_save :check_status_rules

  #validate :validate_properties

  def self.geometry_bounds project_type_id, user_id, attribute_filters, filtered_form_ids, from_date, to_date,intersect_width_layers,active_layers,filters_layers,timeslider_layers
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
    @bounds = ProjectTypesController.set_project_filter @bounds, @project_filter, user_id
    @bounds = ProjectTypesController.set_time_slider @bounds, from_date, to_date
    @bounds = ProjectTypesController.set_filtered_form_ids @bounds, filtered_form_ids
    @bounds = ProjectTypesController.set_filters_on_the_fly @bounds, attribute_filters
    @bounds = ProjectTypesController.set_intersect_width_layers @bounds, intersect_width_layers, active_layers, filters_layers, timeslider_layers
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

  def disable_form
    self.row_enabled = false
    self.disabled_at = Time.zone.now
    save!
  end

  def enable_form
    self.row_enabled = true
    self.disabled_at = ''
    save!
  end

  def update_form properties, project_status_id
    update_status = ''
    if properties.present?
      properties.each do |key, value|
        self.properties[key] = value
      end
    end
    # NOTE: cuando es 0 es porque al controlador llega nulo
    if project_status_id != 0 && self.project_status_id != project_status_id
      self.properties['app_estado'] = project_status_id
      self.project_status_id = project_status_id
      update_status = true
    else
      update_status = false
    end

    self.gwm_updated_at = Time.zone.now
    save!

    if update_status
      update_inheritable_statuses
    end
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
        .where("small_geom.row_enabled = true")
        .where("big_geom.row_active = true")
        .where("big_geom.current_season = true")
        .where("big_geom.row_enabled = true")
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

  def check_status_rules
    rules = ProjectStatusRule.where(project_type_id: self.project_type_id)

    rules.each do |rule|
      key_value = self.properties[rule.json_key]

      next unless key_value.present?
  
      if rule.trigger_value.match?(/^(\d+(\.\d+)?)-(\d+(\.\d+)?)$/)
        if match_range?(key_value, rule.trigger_value) #rangos
          self.update_column(:project_status_id, rule.project_status_id)
          break
        end
      elsif rule.trigger_value.match?(/^([<>]=?)(\d+(\.\d+)?)$/) #>,<
        if match_operator?(key_value, rule.trigger_value)
          self.update_column(:project_status_id, rule.project_status_id)
          break
        end
      else
        if match_text?(key_value, rule.trigger_value) #Comparación de palabras o arrays
          self.update_column(:project_status_id, rule.project_status_id)
          break
        end
      end
    end
  end
  
  private
  
  def match_operator?(key_value, trigger_value)
    operator, number = trigger_value.match(/^([<>]=?)(\d+(\.\d+)?)$/).captures
    number = number.to_f
    key_value = key_value.to_f
  
    case operator
    when ">"  then key_value > number
    when "<"  then key_value < number
    when ">=" then key_value >= number
    when "<=" then key_value <= number
    else false
    end
  end
  
  def match_range?(key_value, trigger_value)
    return false unless trigger_value.match(/^(\d+(\.\d+)?)-(\d+(\.\d+)?)$/)
  
    min, max = $1.to_f, $3.to_f
    key_value.to_f.between?(min, max)
  end

  def match_text?(key_value, trigger_value)
    return false if key_value.blank? || trigger_value.blank?
  
    key_value = normalize_value(key_value)
    trigger_value = normalize_value(trigger_value)

    begin
      trigger_value = JSON.parse(trigger_value) if trigger_value.is_a?(String) && trigger_value.strip.start_with?("[")
    rescue JSON::ParserError
      trigger_value = [trigger_value]
    end

    if key_value.is_a?(String)
      key_value = key_value.split(',').map(&:strip)
    end

    if key_value.is_a?(Array)
      return (trigger_value & key_value).any?
    elsif key_value.is_a?(String)
      return key_value.include?(trigger_value.join(', '))
    end
  
    false
  end

  def normalize_value(value)
    if value.is_a?(String)
      value.strip.downcase
    elsif value.is_a?(Array)
      value.map { |v| v.strip.downcase }
    else
      value
    end
  end  
end
