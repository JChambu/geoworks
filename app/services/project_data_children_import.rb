class ProjectDataChildrenImport
  include ActiveModel::Validations

  VALID_FIELD_TYPE_ID = FieldType::SUBFORM

  attr_accessor :project_type, :entries

  validates :project_type, :entries, presence: true

  validate :verify_entries

  def verify_entries
    entries.each do |entry|
      project = project_type.projects.find_by(id: entry['project_id'])
      unless project
        errors.add(:project, "El registro con id=#{entry["project_id"]} no pertenece a #{project_type.name}")
        next
      end

      project_field = project_type.project_fields.find_by(id: entry['project_field_id'])
      unless project_field
        errors.add(:project_field, "El field con id=#{entry["project_field_id"]} no pertenece a #{project_type.name}")
        next
      end

      if project_field.field_type_id != VALID_FIELD_TYPE_ID
        errors.add(:project_field, "El campo #{project_field.name} no es del tipo subformulario")
        next
      end

      entry['properties'].each do |project_subfield_id, value|
        project_subfield = project_field.project_subfields.find_by(id: project_subfield_id)
        unless project_subfield
          errors.add(:project_subfield, "El subfield con id=#{project_subfield_id} no pertenece al field #{project_field.name}")
          next
        end

        wrong_subfield = false
        case project_subfield.field_type_id
        when FieldType::DATE
          has_right_format = /\d{2}\/\d{2}\/\d{4}/.match? value
          date = Date.parse(value) rescue false if has_right_format
          wrong_subfield = !has_right_format && !date
        when FieldType::NUMERIC
          is_numeric = Float(value) != nil rescue false
          wrong_subfield = !is_numeric
        when FieldType::BOOLEAN
          is_true = value.to_s.downcase == 'true'
          is_false = value.to_s.downcase == 'false'
          wrong_subfield = !is_true && !is_false
        when FieldType::SINGLE_LIST
          wrong_subfield = value.is_a?(Array) ? value.length != 1 : false
        when FieldType::MULT_LIST
          wrong_subfield = value.is_a?(Array) ? value.length < 1 : false
        end

        if wrong_subfield
          errors.add(:project_subfield, "El valor para subfield con id=#{project_subfield_id} es invalido")
          next
        end
      end
    end
  end

  def save
    return false unless self.valid?
    project_data_children = []
    entries.each do |entry|
      project_data_child = ProjectDataChild.create(
        properties: entry['properties'],
        project_id: entry['project_id'],
        project_field_id: entry['project_field_id'],
        user_id: entry['user_id'],
        gwm_created_at: Time.zone.now,
        gwm_updated_at: Time.zone.now,
      )
      project_data_children << project_data_child.id
    end

    ProjectDataChild.where(id: project_data_children)
  end
end
