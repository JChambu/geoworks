class CreateLoadLocations < ActiveRecord::Migration[5.0]
  def change
    create_table :load_locations do |t|
      t.string :name
      t.timestamps
    end
  end
end
