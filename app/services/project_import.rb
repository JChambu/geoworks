class ProjectImport
  include ActiveModel::Validations

  attr_accessor :project_type, :entries, :current_user, :mapping

  validates :project_type, :entries, presence: true

  def save
    return false unless self.valid?
    project_no_valid = []
    generate_entries(entries, mapping).each do |entry|
      project = ProjectData.new
      project.project_type = project_type
      project.properties = entry[:properties]
      project.user_id = entry[:user_id] || current_user.id
      project.gwm_created_at = entry[:gwm_created_at]
      project.gwm_created_at_format = entry[:gwm_created_at_format]
      project.state_id = entry[:state_id]
      project.geometry = entry[:geometry]

      unless project.save
        project_no_valid << {
          "type" => 'Feature',
          "properties" => entry[:properties_original],
          "geometry" => entry[:geometry],
          "errors" => project.errors.messages
        }
      end
    end

    project_no_valid
  end

  private
  def generate_entries(entries, mapping)
    return entries unless mapping
    mapping_entries = mapping[:properties].select{ |_k, v| v.present? }

    entries.map do |entry|
      data = {
        gwm_created_at: Time.now,
        geometry: entry['geometry'],
        user_id: entry['properties'][mapping['user_id']],
        state_id: entry['properties'][mapping["state_id"]],
        gwm_created_at: entry['properties'][mapping["gwm_created_at"]],
        gwm_created_at_format: mapping['gwm_created_at_format'],
        properties: {},
        properties_original: entry['properties']
      }
      mapping_entries.each do |k, v|
        data[:properties][v] = entry['properties'][k]
      end
      data
    end
  end
end
