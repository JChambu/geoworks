class AddColumnAddCityIdToPoiAddressLoads < ActiveRecord::Migration[5.0]
  def change

    add_column :poi_address_loads, :city_id, :integer
    add_column :poi_address_loads, :color, :string
  end
end
