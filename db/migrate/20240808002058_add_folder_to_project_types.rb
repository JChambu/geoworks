class AddFolderToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_reference :project_types, :folder, foreign_key: true
  end
end
