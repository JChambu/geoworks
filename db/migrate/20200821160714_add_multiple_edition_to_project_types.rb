class AddMultipleEditionToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :multiple_edition, :boolean, default: :false
  end
end
