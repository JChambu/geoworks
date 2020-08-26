class AddKpiTypeToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :kpi_type, :string
  end
end
