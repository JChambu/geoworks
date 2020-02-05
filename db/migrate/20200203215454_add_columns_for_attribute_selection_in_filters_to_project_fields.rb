class AddColumnsForAttributeSelectionInFiltersToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :filter_field, :boolean, default: false
    add_column :project_fields, :heatmap_field, :boolean, default: false
    add_column :project_fields, :colored_points_field, :boolean, default: false
  end
end
