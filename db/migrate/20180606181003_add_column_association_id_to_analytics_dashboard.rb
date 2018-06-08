class AddColumnAssociationIdToAnalyticsDashboard < ActiveRecord::Migration[5.1]
  def change
    add_column :analytics_dashboards, :association_id, :integer 
  end
end
