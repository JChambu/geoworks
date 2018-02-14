class AddColumntGroupToAnalyticsDashboard < ActiveRecord::Migration[5.0]
  def change
    add_column :analytics_dashboards, :group_field, :string
    add_column :analytics_dashboards, :conditions_field, :string
  
  end
end
