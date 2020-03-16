class AnalyticsDashboard < ApplicationRecord

  include AnalyticsDashboards::Scopes

  belongs_to :analysis_type
  belongs_to :dashboard
 # belongs_to :project_field
  belongs_to :condition_field, :class_name => "ProjectField", :foreign_key => "condition_field_id"
  belongs_to :project_field, :class_name => "ProjectField", :foreign_key => "project_field_id"
  belongs_to :group_field, :class_name => "ProjectField", :foreign_key => "group_field_id"
  belongs_to :chart
  belongs_to :project_type
  validates :title, presence: :true

end
