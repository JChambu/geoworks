class AddColumnPhoneAndStreet2ToExtendedListings < ActiveRecord::Migration[5.0]
  def change
      add_column :extended_listings, :phone_2, :string
      add_column :extended_listings, :phone_2_new, :string
      add_column :extended_listings, :street_2, :string

  
  end
end
