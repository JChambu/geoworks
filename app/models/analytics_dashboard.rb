class AnalyticsDashboard < ApplicationRecord

  include AnalyticsDashboards::Scopes

  belongs_to :analysis_type
  belongs_to :dashboard
  belongs_to :condition_field, :class_name => "ProjectField", :foreign_key => "condition_field_id"
  belongs_to :project_field, :class_name => "ProjectField", :foreign_key => "project_field_id"
  belongs_to :group_field, :class_name => "ProjectField", :foreign_key => "group_field_id"
  belongs_to :chart
  belongs_to :project_type

  #validates :title, :analysis_type_id, :project_field_id, presence: :true, if: :is_simple_analytics?
  #validates :title, :sql_sentence, presence: :true, unless: :is_simple_analytics?

  def is_simple_analytics?
    return true if self.advanced_kpi == false
    return false
  end

end
