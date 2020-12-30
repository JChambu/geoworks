class AddDataTableToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :data_table, :boolean, default: false
  end
end
