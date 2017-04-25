class AddColumnNameToPoiAddresses < ActiveRecord::Migration[5.0]
  def change

     add_column :poi_addresses, :name, :string 
  
  end
end
