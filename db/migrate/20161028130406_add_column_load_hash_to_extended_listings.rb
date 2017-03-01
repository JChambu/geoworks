class AddColumnLoadHashToExtendedListings < ActiveRecord::Migration[5.0]
  def change

      add_column :extended_listings, :hash_value, :string 

  end
end
