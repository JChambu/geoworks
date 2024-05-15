class AddHeatmapFieldToProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_subfields, :heatmap_field, :boolean, default: false
  end
end
