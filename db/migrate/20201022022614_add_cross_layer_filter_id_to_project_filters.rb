class AddCrossLayerFilterIdToProjectFilters < ActiveRecord::Migration[5.1]
  def change
    add_column :project_filters, :cross_layer_filter_id, :integer
  end
end
