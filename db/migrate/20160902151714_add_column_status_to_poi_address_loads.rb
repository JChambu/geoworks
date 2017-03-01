class AddColumnStatusToPoiAddressLoads < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_address_loads, :success_count, :string
    add_column :poi_address_loads, :fail_count, :string
    add_column :poi_address_loads, :already_loaded_count, :string
  
  end
end
