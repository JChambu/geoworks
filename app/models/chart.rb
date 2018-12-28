class Chart < ApplicationRecord
  #has_many :analytics_dashboards
  has_many :graphics_properties
  has_many :graphics
end
