class AddCoverToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :cover, :text
  end
end
