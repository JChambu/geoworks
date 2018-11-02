class Graphic < ApplicationRecord
  belongs_to :analytics_dashboard
  belongs_to :graphics_property
end
