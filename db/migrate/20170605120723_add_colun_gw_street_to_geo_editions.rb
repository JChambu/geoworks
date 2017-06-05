class AddColunGwStreetToGeoEditions < ActiveRecord::Migration[5.0]
  def change
    add_column :geo_editions, :gw_street, :string
    add_column :geo_editions, :gw_code, :string
  
  end
end
