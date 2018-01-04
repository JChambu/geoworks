class AddColumnDirectoryNameToProjectTypes < ActiveRecord::Migration[5.0]
  def change
      add_column :project_types, :directory_name, :string
  
  end
end
