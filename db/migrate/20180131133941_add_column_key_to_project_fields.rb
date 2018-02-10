class AddColumnKeyToProjectFields < ActiveRecord::Migration[5.0]
  def change
      add_column :project_fields, :key, :string
  end
end
