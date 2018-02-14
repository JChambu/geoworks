class AddColumnFilterInputToAnalyticsDashboards < ActiveRecord::Migration[5.0]
  def change

    add_column :analytics_dashboards, :filter_input, :string
    add_column :analytics_dashboards, :input_value, :string
  
  end
end
