class RemoveAdvancedKpiFromAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    remove_column :analytics_dashboards, :advanced_kpi, :boolean
  end
end
