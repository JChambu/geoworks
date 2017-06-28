class AddColumnObservationToGeoEditions < ActiveRecord::Migration[5.0]
  def change
    add_column :geo_editions, :observations, :text
  end
end
