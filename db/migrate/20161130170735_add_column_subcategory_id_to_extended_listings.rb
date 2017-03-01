class AddColumnSubcategoryIdToExtendedListings < ActiveRecord::Migration[5.0]
  def change
    add_column :extended_listings, :category_original_id, :integer
  end
end
