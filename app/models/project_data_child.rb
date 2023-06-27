class ProjectDataChild < ApplicationRecord
  belongs_to :project
  before_update :update_sequence_project_data_children

  def update_sequence_project_data_children
    sequence_name = 'project_data_children_update_sequence_seq'
    @a = ActiveRecord::Base.connection.execute("SELECT nextval('#{sequence_name}')")
    self.update_sequence = @a[0]['nextval']
  end

  def update_subform properties
    attributes = {
      properties: properties,
      gwm_updated_at: Time.zone.now
    }
    self.update_attributes(attributes)
  end

  def create_subform properties, project_id, project_field_id, user_id
    self.properties = properties
    self.project_id = project_id
    self.project_field_id = project_field_id
    self.user_id = user_id
    self.gwm_created_at = Time.zone.now
    self.gwm_updated_at = Time.zone.now
    self.save unless project_id.to_i == ProjectDataChild.last.project_id
  end

end
