class GraphicsProperty < ApplicationRecord

  belongs_to :graphic
  belongs_to :chart
  validates :chart_id, :analytics_dashboard_id, presence: true

end
