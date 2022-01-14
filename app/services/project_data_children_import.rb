class ProjectDataChildrenImport
  include ActiveModel::Validations

  attr_accessor :project_type, :entries, :current_user

  validates :project_type, :entries, presence: true

  def save
    return false unless self.valid?
    project_data_children_no_valid = []
    entries.each do |entry|
      project_data_child = ProjectDataChildren.new
      project_data_child.project_type = project_type
      project_data_child.properties = entry['properties']
      project_data_child.project_id = entry['project_id']
      project_data_child.project_field_id = entry['project_field_id']
      project_data_child.user_id = entry['user_id'].present? ? entry['user_id'] : current_user.id
      project_data_child.gwm_created_at = entry['gwm_created_at']
      project_data_child.ignore_duplicated = entry['ignore_duplicated']

      unless project_data_child.save
        project_data_children_no_valid << project_data_child
      end
    end

    project_data_children_no_valid
  end
end
