class ProjectData
  include ActiveModel::Validations
  include ActiveModel::Serialization

  VALID_FIELD_TYPE_ID = FieldType::SUBFORM

  attr_accessor :project_type, :project_id, :properties, :user_id, :gwm_created_at, :geometry

  validates :project_type, :properties, presence: true

  validate :verify_geometry_type
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

    Project.create(
      properties: properties,
      properties_original: properties,
      project_type_id: project_type.id,
      user_id: user_id,
      gwm_created_at: gwm_created_at,
      gwm_updated_at: gwm_created_at,
      project_status_id: project_type.project_statuses.default.id,
      the_geom: coordinates
    )
  end

  private

  def verify_properties
    properties.each do |project_field, value|
      project_field = project_type&.project_fields&.find_by(name: project_field)

      wrong_subfield = false
      case project_field.field_type_id
      when FieldType::DATE
        has_right_format = /\d{2}\/\d{2}\/\d{4}/.match? value
        date = Date.parse(value) rescue false if has_right_format
        errors.add("#{value}", "Fecha invalida") if !has_right_format && !date
      when FieldType::NUMERIC
        is_numeric = Float(value) != nil rescue false
        errors.add("#{value}", "No es númerico") if !is_numeric
      when FieldType::BOOLEAN
        is_true = value.to_s.downcase == 'true'
        is_false = value.to_s.downcase == 'false'
        errors.add("#{value}", "No es booleano") if !is_true && !is_false
      when FieldType::SINGLE_LIST
        wrong_subfield = value.is_a?(Array) ? value.length != 1 : true
        errors.add("#{value}", "No es un arreglo de un item") if wrong_subfield
      when FieldType::MULT_LIST
        wrong_subfield = value.is_a?(Array) ? value.length < 1 : true
        errors.add("#{value}", "No es un arreglo con mas de un item") if wrong_subfield
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
    "POLYGON(#{coordinates.join(', ')})"
  end
end
