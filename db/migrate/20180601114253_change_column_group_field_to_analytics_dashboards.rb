class ChangeColumnGroupFieldToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    remove_column :analytics_dashboards, :group_field
    add_column :analytics_dashboards, :group_field_id, :integer
  end
end
