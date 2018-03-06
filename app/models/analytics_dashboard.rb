class AnalyticsDashboard < ApplicationRecord
  belongs_to :analysis_type
  belongs_to :project_type
 # belongs_to :project_field
  belongs_to :condition_field, :class_name => "ProjectField", :foreign_key => "condition_field_id"
  belongs_to :project_field, :class_name => "ProjectField", :foreign_key => "project_field_id"
  belongs_to :chart


end
