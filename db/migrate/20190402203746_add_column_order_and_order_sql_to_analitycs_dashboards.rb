class AddColumnOrderAndOrderSqlToAnalitycsDashboards < ActiveRecord::Migration[5.1]
  def change
      add_column :analytics_dashboards, :order, :integer
      add_column :analytics_dashboards, :order_sql, :string
  end
end
