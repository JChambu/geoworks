class AddColumnPhoneWebToPoiAddresses < ActiveRecord::Migration[5.0]
  def change

    add_column :poi_addresses, :phone, :string
    add_column :poi_addresses, :web, :string
  
  end
end
