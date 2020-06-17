class AnalyticsDashboard < ApplicationRecord

  include AnalyticsDashboards::Scopes

  belongs_to :analysis_type
  belongs_to :dashboard
  belongs_to :condition_field, :class_name => "ProjectField", :foreign_key => "condition_field_id"
  belongs_to :project_field, :class_name => "ProjectField", :foreign_key => "project_field_id"
  belongs_to :group_field, :class_name => "ProjectField", :foreign_key => "group_field_id"
  belongs_to :chart
  belongs_to :project_type

  validates :title, :analysis_type_id, :project_field_id, presence: :true, if: :is_basic_kpi?
  validates :title, :sql_sentence, presence: :true, if: :is_complex_kpi?
  validates :title, :sql_full, presence: :true, if: :is_advanced_kpi?

  def is_basic_kpi?
    return true if self.kpi_type == 'basic'
    return false
  end

  def is_complex_kpi?
    return true if self.kpi_type == 'complex'
    return false
  end

  def is_advanced_kpi?
    return true if self.kpi_type == 'advanced'
    return false
  end

end
