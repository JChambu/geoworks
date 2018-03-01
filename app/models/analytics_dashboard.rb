class AnalyticsDashboard < ApplicationRecord
  belongs_to :analysis_type
  belongs_to :project_type
  belongs_to :project_field
  belongs_to :chart


end
