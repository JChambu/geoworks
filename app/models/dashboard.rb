class Dashboard < ApplicationRecord
  belongs_to :project_type
  has_many :graphics_properties
  has_many :analytics_dashboards
  has_many :graphics
end
