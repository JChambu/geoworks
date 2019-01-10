class AddColumnHiddenToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :hidden, :boolean, default: false
  end
end
