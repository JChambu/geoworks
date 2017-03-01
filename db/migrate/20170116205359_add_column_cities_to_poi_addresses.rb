class AddColumnCitiesToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_addresses, :city_name, :string
    add_column :poi_addresses, :department_name, :string
    add_column :poi_addresses, :province_name, :string
    add_column :poi_addresses, :country_name, :string
  
  end
end
