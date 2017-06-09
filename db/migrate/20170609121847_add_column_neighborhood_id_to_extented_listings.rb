class AddColumnNeighborhoodIdToExtentedListings < ActiveRecord::Migration[5.0]
  def change
      add_column :extended_listings, :neighborhood_id, :integer
  end
end
