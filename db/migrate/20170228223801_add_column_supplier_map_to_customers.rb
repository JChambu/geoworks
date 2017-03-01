class AddColumnSupplierMapToCustomers < ActiveRecord::Migration[5.0]
  def change
    add_column :customers, :supplier_map, :string, default: 'osm'
  
  end
end
