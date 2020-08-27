class ChangeRoleColumnsInProjectFieldsAndSubfields < ActiveRecord::Migration[5.1]
  def change
    rename_column :project_fields, :role, :roles_read
    rename_column :project_subfields, :role, :roles_read
    add_column :project_fields, :roles_edit, :string
    add_column :project_subfields, :roles_edit, :string
  end
end
