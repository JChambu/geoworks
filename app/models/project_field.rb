class ProjectField < ApplicationRecord
  belongs_to :project_type
  has_many :analytics_dashboards
end
