class AddColumnReadonlyToProjectFields < ActiveRecord::Migration[5.1]
  def change
      add_column :project_fields, :readonly, :boolean, default: false
  end
end
