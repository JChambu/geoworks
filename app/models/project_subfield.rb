class ProjectSubfield < ApplicationRecord
 include RailsSortable::Model
   set_sortable :sort
   belongs_to :project_field
   before_create :key_name

  def key_name
      self.key = self.name.gsub(/\s+/, '_').downcase
  end
end
