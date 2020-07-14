class ChangeColumnDefaultGeoRestrictionToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    remove_column :project_types, :geo_restriction
    add_column :project_types, :geo_restriction, :integer, null: false, default: 0
  end
end
