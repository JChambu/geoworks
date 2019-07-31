class AddColumnGroupSqlToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :group_sql, :text
  end
end
