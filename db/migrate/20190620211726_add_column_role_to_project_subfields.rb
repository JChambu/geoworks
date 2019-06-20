class AddColumnRoleToProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_subfields, :role, :string
  end
end
