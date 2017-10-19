class ProjectType < ApplicationRecord

  belongs_to :user
  has_many :fields, class_name: "ProjectField"
  accepts_nested_attributes_for :fields, allow_destroy: true

  validate :validate_options

  def validate_options
    self.fields.each do |field|
      if field.cleasing_data?
        new_field = "new_" + field.name
        @new_project_field =  ProjectField.create(name: new_field, field_type: 'text_field', project_type_id: field.product_type_id)
        @new_project_field.save
      end
    end
  end


  def self.query_fulcrum
    client = Fulcrum::Client.new('c6abd6bd9e786cecd7a105395126352bde51d99e054c44256f1652ae0a4fbe4ef4bbf4f2022d84af')
    forms = client.forms.all
  
  
  end




end
