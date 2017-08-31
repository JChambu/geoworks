class AddColumnYardWastelandToGeoEditions < ActiveRecord::Migration[5.0]
  def change

    add_column :geo_editions, :yard, :boolean
    add_column :geo_editions, :wasteland, :boolean
  end
end
