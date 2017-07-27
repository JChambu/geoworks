class CreateStreets < ActiveRecord::Migration[5.0]
  def change
    create_table :streets do |t|
      t.integer :start_number
      t.integer :end_number
      t.integer :count_intersections
      t.float :meters_long_intersection
      t.line :the_geom, :geographic => false, :srid => 4326, :has_z => false
      t.string :name
      t.integer :city_id
      t.integer :street_type_id
      t.integer :code
      t.string :city_name
      t.timestamps
    end
  end
end
