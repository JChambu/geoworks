class ProjectDataChildren
  include ActiveModel::Validations
  include ActiveModel::Serialization

  VALID_FIELD_TYPE_ID = FieldType::SUBFORM

  attr_accessor :project_type, :project_id, :project_field_id, :properties, :user_id

  validates :project_type, :project_field_id, :properties, presence: true

  validate :verify_project
  validate :verify_project_field
  validate :verify_properties

  def attributes
    {
      project_id: nil,
      project_field_id: nil,
      properties: nil,
      user_id: nil
    }
  end

  def verify_project
    project = project_type&.projects&.find_by(id: project_id)
    unless project
      errors.add(:project_id, "No pertenece a #{project_type&.name}")
    end
  end

  def verify_project_field
    project_field = project_type&.project_fields&.find_by(id: project_field_id)
    unless project_field
      errors.add(:project_field_id, "No pertenece a #{project_type&.name}")
      return
    end

    unless project_field.field_type_id == VALID_FIELD_TYPE_ID
      errors.add(:project_field_id, "No es del tipo subformulario")
    end
  end

  def verify_properties
    project_field = project_type&.project_fields&.find_by(id: project_field_id)

    if project_field
      properties.each do |project_subfield_id, value|
        project_subfield = project_field.project_subfields.find_by(id: project_subfield_id)
        unless project_subfield
          errors.add("#{project_subfield_id}", "No pertenece al field")
          next
        end

        wrong_subfield = false
        case project_subfield.field_type_id
        when FieldType::DATE
          has_right_format = /\d{2}\/\d{2}\/\d{4}/.match? value
          date = Date.parse(value) rescue false if has_right_format
          errors.add("#{project_subfield.id}", "Fecha invalida") if !has_right_format && !date
        when FieldType::NUMERIC
          is_numeric = Float(value) != nil rescue false
          errors.add("#{project_subfield.id}", "No es númerico") if !is_numeric
        when FieldType::BOOLEAN
          is_true = value.to_s.downcase == 'true'
          is_false = value.to_s.downcase == 'false'
          errors.add("#{project_subfield.id}", "No es booleano") if !is_true && !is_false
        when FieldType::SINGLE_LIST
          wrong_subfield = value.is_a?(Array) ? value.length != 1 : false
          errors.add("#{project_subfield.id}", "No es un arreglo de un item") if wrong_subfield
        when FieldType::MULT_LIST
          wrong_subfield = value.is_a?(Array) ? value.length < 1 : false
          errors.add("#{project_subfield.id}", "No es un arreglo con mas de un item") if wrong_subfield
        end
      end
    end
  end

  def save
    return false unless self.valid?

    ProjectDataChild.create(
      properties: properties,
      project_id: project_id,
      project_field_id: project_field_id,
      user_id: user_id,
      gwm_created_at: Time.zone.now,
      gwm_updated_at: Time.zone.now,
    )
  end
end
