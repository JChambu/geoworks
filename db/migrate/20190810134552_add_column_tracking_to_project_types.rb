class AddColumnTrackingToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :tracking, :boolean, default: :false
  end
end
