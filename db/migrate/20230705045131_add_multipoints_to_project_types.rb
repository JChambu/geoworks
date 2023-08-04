class AddMultipointsToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :multipoints, :boolean, default: :false
  end
end
