class AddColumnNameLayerToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :name_layer, :string
  end
end
