class RenameColumnChartToAnalyticsDashboards < ActiveRecord::Migration[5.0]
  def change
    rename_column :analytics_dashboards, :chart, :graph
  
  end
end
