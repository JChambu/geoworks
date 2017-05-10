class AddColumnPoiStatusIdToGeoEditions < ActiveRecord::Migration[5.0]
  def change
    add_column :geo_editions, :poi_status_id, :integer
  
  end
end
