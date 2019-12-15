class AddColumnReadonlyToProjectFields < ActiveRecord::Migration[5.1]
  def change
      add_column :project_fields, :read_only, :boolean, default: false
  end
end
