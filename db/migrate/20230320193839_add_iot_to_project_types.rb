class AddIotToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :iot, :boolean, default: :false
  end
end
