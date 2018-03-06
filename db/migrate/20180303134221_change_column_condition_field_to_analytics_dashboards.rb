class ChangeColumnConditionFieldToAnalyticsDashboards < ActiveRecord::Migration[5.0]
  def change
    remove_column :analytics_dashboards, :conditions_field
    add_column :analytics_dashboards, :condition_field_id, :integer
  
  end
end
