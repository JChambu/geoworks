class AddColumnRestaurantTypeIdToPois < ActiveRecord::Migration[5.0]
  def change
      add_column :pois, :restaurant_type_id, :integer
  end
end
