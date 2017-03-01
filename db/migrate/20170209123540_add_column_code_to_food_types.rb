class AddColumnCodeToFoodTypes < ActiveRecord::Migration[5.0]
  def change
    add_column :food_types, :code, :string
  end
end
