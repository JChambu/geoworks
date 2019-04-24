class ProjectField < ApplicationRecord
  belongs_to :project_type
  has_many :analytics_dashboards
  belongs_to :field_type
end
