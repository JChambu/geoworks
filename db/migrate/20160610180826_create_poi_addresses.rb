class CreatePoiAddresses < ActiveRecord::Migration[5.0]
  def change
    create_table :poi_addresses do |t|
      t.integer :city_id
      t.string :street
      t.string :number
      t.string :neighborhood
      t.string :block
      t.string :house
      t.point :the_geom

      t.timestamps
    end
  end
end
