class AddColumnPhoneToExtendedListings < ActiveRecord::Migration[5.0]
  def change
    add_column :extended_listings, :phone, :string
    add_column :extended_listings, :source, :string
  
  end
end
