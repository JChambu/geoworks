class AddColumnAnalyticsDashboardIdToGraphicsProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics_properties, :analitycs_dashboard_id, :integer
  end
end
