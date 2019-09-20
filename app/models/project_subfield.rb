class ProjectSubfield < ApplicationRecord
 include RailsSortable::Model
   set_sortable :sort
  
   belongs_to :project_field
end
