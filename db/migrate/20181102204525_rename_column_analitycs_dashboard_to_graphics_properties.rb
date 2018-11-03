class RenameColumnAnalitycsDashboardToGraphicsProperties < ActiveRecord::Migration[5.1]
  def change
    rename_column :graphics_properties, :analitycs_dashboard_id, :analytics_dashboard_id
  end
end
