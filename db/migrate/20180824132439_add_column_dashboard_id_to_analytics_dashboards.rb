class AddColumnDashboardIdToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :dashboard_id, :integer
  end
end
