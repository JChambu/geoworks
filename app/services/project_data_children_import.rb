class ProjectDataChildrenImport
  include ActiveModel::Validations

  attr_accessor :project_type, :entries, :current_user, :mapping

  validates :project_type, :entries, presence: true

  def save
    return false unless self.valid?
    project_data_children_no_valid = []
    generate_entries(entries, mapping).each do |entry|
      project_data_child = ProjectDataChildren.new
      project_data_child.project_type = project_type
      project_data_child.properties = entry[:properties]
      project_data_child.project_id = entry[:project_id]
      project_data_child.project_field_id = entry[:project_field_id]
      project_data_child.user_id = entry[:user_id].present? ? entry[:user_id] : current_user.id
      project_data_child.gwm_created_at = entry[:gwm_created_at]
      project_data_child.gwm_created_at_format = entry[:gwm_created_at_format]

      unless project_data_child.save
        project_data_children_no_valid << project_data_child
      end
    end

    project_data_children_no_valid
  end

  private
  def generate_entries(entries, mapping)
    return entries unless mapping
    data_child = mapping["data_child"].select{|_k, v| v.present?}

    entries.map do |entry|
      projects = project_type.projects.where("properties ->> '#{mapping['project_field_key']}' = '#{entry[mapping['project_relationship']]}'")

      data = {
        project_id: projects.length == 1 ? projects.first.id : nil,
        project_field_id: mapping['project_field_id'],
        user_id: entry[mapping['user_id']],
        gwm_created_at: entry[mapping["gwm_created_at"]],
        gwm_created_at_format: mapping["gwm_created_at_format"],
        properties: {}
      }
      data_child.each do |k, v|
        data[:properties][v] = entry[k]
      end
      data
    end
  end
end
