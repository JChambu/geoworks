class AddColumnUserIdToGeoEditions < ActiveRecord::Migration[5.0]
  def change
    add_column :geo_editions, :user_id, :integer
  end
end
