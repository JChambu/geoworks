class AddColumnAddressCompleteToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_addresses, :address_complete, :string
  end
end
