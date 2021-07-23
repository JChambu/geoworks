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

end
