class ProjectField < ApplicationRecord
 include RailsSortable::Model
   set_sortable :sort

  belongs_to :project_type
  has_many :analytics_dashboards
  belongs_to :field_type
end
