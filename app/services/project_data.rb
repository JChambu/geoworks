class ProjectData
  include ActiveModel::Validations
  include ActiveModel::Serialization

  VALID_FIELD_TYPE_ID = FieldType::SUBFORM

  attr_accessor :project_type, :project_id, :properties, :user_id, :gwm_created_at,
  :geometry, :state_id, :gwm_created_at_format

  validates :project_type, :properties, presence: true

  validate :verify_geometry_type
  validate :verify_status
  validate :verify_gwm_created_at
  validate :verify_user
  validate :verify_properties

  def attributes
    {
      project_id: nil,
      project_field_id: nil,
      properties: nil,
      user_id: nil,
      gwm_created_at: nil,
      gwm_created_at_format: nil
    }
  end

  def save
    return false unless self.valid?

    project_status_id = state_id || project_type.project_statuses.default.id || project_type.project_statuses.first.id

    project = Project.create(
      project_type_id: project_type.id,
      user_id: user_id,
      gwm_created_at: gwm_created_at.present? ? Date.strptime(gwm_created_at, gwm_created_at_format) : Time.now,
      gwm_updated_at: gwm_created_at.present? ? Date.strptime(gwm_created_at, gwm_created_at_format) : Time.now,
      project_status_id: project_status_id,
      the_geom: coordinates
    )

    project.update(
      properties: properties.merge({
        app_id: project.id,
        app_usuario: user_id,
        app_estado: project_status_id
        })
      )
  end

  private

  def verify_status
    return true unless state_id.present?
    project_status = project_type.project_statuses.find_by(id: state_id)
    unless project_status
      errors.add("state_id => #{state_id}", "No existe el estado para #{project_type&.name}")
      return
    end
  end

  def verify_properties
    properties.each do |project_field, value|
      project_field = project_type&.project_fields&.find_by(key: project_field)

      wrong_subfield = false
      case project_field.field_type_id
      when FieldType::DATE
        has_right_format = /\d{2}\/\d{2}\/\d{4}/.match? value
        date = Date.parse(value) rescue false if has_right_format
        errors.add("#{project_field.name} -> #{value}", "Fecha invalida") if !has_right_format && !date
      when FieldType::NUMERIC
        is_numeric = Float(value) != nil rescue false
        errors.add("#{project_field.name} -> #{value}", "No es númerico") if !is_numeric
      when FieldType::BOOLEAN
        is_true = value.to_s.downcase == 'true'
        is_false = value.to_s.downcase == 'false'
        errors.add("#{project_field.name} -> #{value}", "No es booleano") if !is_true && !is_false
      when FieldType::SINGLE_LIST
        wrong_subfield = value.is_a?(Array) ? value.length != 1 : true
        errors.add("#{project_field.name} -> #{value}", "No es un arreglo de un item") if wrong_subfield
      when FieldType::MULT_LIST
        wrong_subfield = value.is_a?(Array) ? value.length < 1 : true
        errors.add("#{project_field.name} -> #{value}", "No es un arreglo con mas de un item") if wrong_subfield
      end
    end
  end

  def verify_geometry_type
    errors.add("#{geometry}", "La geometria debe ser de tipo #{project_type.type_geometry}") if geometry['type'] != project_type.type_geometry
  end

  def coordinates
    return point_coordinates if geometry['type'] == "Point"
    polygon_coordinates
  end

  def point_coordinates
    latitude, longitude = geometry['coordinates']
    "POINT(#{latitude} #{longitude})"
  end

  def polygon_coordinates
    raw_coordinates = geometry['coordinates'][0]
    coordinates = raw_coordinates.map { |latitude, longitude| "#{latitude} #{longitude}" }
    "POLYGON((#{coordinates.join(', ')}))"
  end

  def verify_gwm_created_at
    return true unless gwm_created_at.present?
    date = Date.strptime(gwm_created_at, gwm_created_at_format) rescue false
    errors.add("gwm_created_at => #{gwm_created_at}", "Fecha invalida, formato seleccionado es #{gwm_created_at_format}") unless date
  end

  def verify_user
    return true unless user_id.present?
    user = project_type.users.find_by(id: user_id)
    errors.add("user => #{user_id}", "No pertenece a #{project_type&.name}") unless user
  end
end
