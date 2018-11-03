class RemoveColumnAnalyticsDashboardIdToGraphics < ActiveRecord::Migration[5.1]
  def change
    remove_column :graphics, :analytics_dashboard_id
  end
end
