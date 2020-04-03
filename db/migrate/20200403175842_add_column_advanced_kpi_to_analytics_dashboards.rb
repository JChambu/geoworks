class AddColumnAdvancedKpiToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :advanced_kpi, :boolean, default: false
  end
end
