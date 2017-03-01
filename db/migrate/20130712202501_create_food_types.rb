class CreateFoodTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :food_types do |t|
      t.string :name
      t.integer :poi_type_id

      t.timestamps
    end
  end
end
