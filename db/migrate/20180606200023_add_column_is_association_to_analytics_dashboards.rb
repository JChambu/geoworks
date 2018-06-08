class AddColumnIsAssociationToAnalyticsDashboards < ActiveRecord::Migration[5.1]
  def change
      add_column :analytics_dashboards, :assoc_kpi, :boolean
  end
end
