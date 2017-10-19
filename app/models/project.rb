class Project < ApplicationRecord
  belongs_to :project_type
  serialize :properties, JSON 
  validate :validate_properties

  def validate_properties
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
