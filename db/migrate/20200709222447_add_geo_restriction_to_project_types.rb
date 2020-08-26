class AddGeoRestrictionToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :geo_restriction, :integer
  end
end
