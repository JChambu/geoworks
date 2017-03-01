class AddColumnPoiStatusIdToExtendedListings < ActiveRecord::Migration[5.0]
  def change
    add_column :extended_listings, :poi_status_id, :integer, default: 2
  end
end
