class AddDateColumnsToProjectsAndProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :gwm_created_at, :datetime
    add_column :projects, :gwm_updated_at, :datetime
    add_column :project_data_children, :gwm_created_at, :datetime
    add_column :project_data_children, :gwm_updated_at, :datetime
  end
end
