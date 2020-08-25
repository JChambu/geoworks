class AddDateColumnsToProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :project_data_children, :gwm_created_at, :datetime
  end
end
