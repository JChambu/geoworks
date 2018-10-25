class AddColumnCommentsToExtendedListings < ActiveRecord::Migration[5.1]
  def change
    add_column :extended_listings, :comments, :string
  end
end
