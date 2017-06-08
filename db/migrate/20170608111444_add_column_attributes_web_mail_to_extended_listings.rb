class AddColumnAttributesWebMailToExtendedListings < ActiveRecord::Migration[5.0]
  def change
    add_column :extended_listings, :website, :string
    add_column :extended_listings, :email, :string
  end
end
