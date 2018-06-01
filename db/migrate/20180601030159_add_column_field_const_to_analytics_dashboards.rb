class AddColumnFieldConstToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :const_field, :string
  end
end
