class AddColumnRoleToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :role, :string
  end
end
