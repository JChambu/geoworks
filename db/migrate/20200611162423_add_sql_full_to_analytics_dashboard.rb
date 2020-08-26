class AddSqlFullToAnalyticsDashboard < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :sql_full, :string
  end
end
