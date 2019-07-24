class AddColumnAddRowsToProjectTypes < ActiveRecord::Migration[5.1]
  def change
      add_column :project_types, :add_rows, :string
  end
end
