class AddColumnAddressNumberToExtendedListings < ActiveRecord::Migration[5.0]
	 def change
    add_column :extended_listings, :address, :string
    add_column :extended_listings, :number, :string

  
  end
end
