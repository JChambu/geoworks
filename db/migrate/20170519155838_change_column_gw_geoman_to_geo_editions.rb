class ChangeColumnGwGeomanToGeoEditions < ActiveRecord::Migration[5.0]
  def change
    rename_column :geo_editions, :gw_geoman, :gw_geomainid
  end
end
