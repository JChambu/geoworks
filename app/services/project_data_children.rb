class ProjectDataChildren
  include ActiveModel::Validations
  include ActiveModel::Serialization

  VALID_FIELD_TYPE_ID = FieldType::SUBFORM

  attr_accessor :project_type, :project_id, :project_field_id, :properties, :user_id, :gwm_created_at, :gwm_created_at_format

  validates :project_type, :project_field_id, :properties, presence: true

  validate :verify_project
  validate :verify_project_field
  validate :verify_properties
  validate :verify_gwm_created_at
  validate :verify_user

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

    ProjectDataChild.create(
      properties: properties,
      project_id: project_id,
      project_field_id: project_field_id,
      user_id: user_id,
      gwm_created_at: gwm_created_at.present? ? Date.strptime(gwm_created_at, gwm_created_at_format) : Time.zone.now,
      gwm_updated_at: gwm_created_at.present? ? Date.strptime(gwm_created_at, gwm_created_at_format) : Time.zone.now,
    )
  end

  private

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
          wrong_subfield = value.is_a?(Array) ? value.length != 1 : true
          errors.add("#{project_subfield.id}", "No es un arreglo de un item") if wrong_subfield
        when FieldType::MULT_LIST
          wrong_subfield = value.is_a?(Array) ? value.length < 1 : true
          errors.add("#{project_subfield.id}", "No es un arreglo con mas de un item") if wrong_subfield
        end
      end
    end
  end

  def verify_gwm_created_at
    return true unless gwm_created_at.present?
    date = Date.strptime(gwm_created_at, gwm_created_at_format) rescue false
    errors.add(:gwm_created_at, "Fecha invalida, formato seleccionado es #{gwm_created_at_format}") unless date
  end

  def verify_user
    return true unless user_id.present?
    user = project_type.users.find_by(id: user_id)
    errors.add(:user_id, "No pertenece a #{project_type&.name}") unless user
  end
end
