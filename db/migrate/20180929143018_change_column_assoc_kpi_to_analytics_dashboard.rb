class ChangeColumnAssocKpiToAnalyticsDashboard < ActiveRecord::Migration[5.1]
  def change
    change_column :analytics_dashboards, :assoc_kpi, :boolean, default: :false
  end
end
