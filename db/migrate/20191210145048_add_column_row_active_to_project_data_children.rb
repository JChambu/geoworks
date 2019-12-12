class AddColumnRowActiveToProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :project_data_children, :row_active, :boolean, default: true
  end
end
