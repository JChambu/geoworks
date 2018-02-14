class ChangeColumnFieldsToAnalyticsDashboards < ActiveRecord::Migration[5.0]
  def change
      #remove_column :analytics_dashboards, :fields
      add_column :analytics_dashboards, :project_field_id, :integer
  end
end
