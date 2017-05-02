class AddColumnPoiTypeAndPoiSubtypeToExtendedListings < ActiveRecord::Migration[5.0]
  def change
    add_column :extended_listings, :poi_type_id, :integer
    add_column :extended_listings, :poi_sub_type_id, :integer
  end
end
