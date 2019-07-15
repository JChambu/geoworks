class AddColumnEnabledAsLayerAndLayerColorToProjectTypes < ActiveRecord::Migration[5.1]
  def change
      add_column :project_types, :enabled_as_layer, :boolean
      add_column :project_types, :layer_color, :string

  end
end
