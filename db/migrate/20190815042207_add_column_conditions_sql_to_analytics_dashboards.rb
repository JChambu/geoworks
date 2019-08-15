class AddColumnConditionsSqlToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :conditions_sql, :string
  end
end
