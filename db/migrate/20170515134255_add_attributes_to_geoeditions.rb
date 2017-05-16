class AddAttributesToGeoeditions < ActiveRecord::Migration[5.0]
  def change
    add_column :geo_editions, :gw_div1, :integer
    add_column :geo_editions, :gw_div2, :integer
    add_column :geo_editions, :gw_geoman, :integer
    add_column :geo_editions, :gw_qh, :integer
    add_column :geo_editions, :gw_calleid, :integer
    add_column :geo_editions, :gw_pta_ini, :integer
    add_column :geo_editions, :gw_pta_fin, :integer
    add_column :geo_editions, :gw_paridad, :string
    add_column :geo_editions, :gw_status, :string
  
  end
end
