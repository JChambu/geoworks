class AddColumnDeliveredToGeoEditions < ActiveRecord::Migration[5.0]
  def change
      add_column :geo_editions, :delivered, :boolean, default: :false
  end
end
