class CreateParkings < ActiveRecord::Migration[5.0]
  def change
    create_table :parkings do |t|
      t.string :name
      t.string :street
      t.string :brand
      t.string :operator
      t.integer :facility_type_id
      t.integer :levels
      t.integer :city_id
      t.st_point :the_geom, :geographic => false, :srid => 4326, :has_z => false
      t.st_point :the_geom_entrance, :geographic => false, :srid => 4326, :has_z => false
      t.st_point :the_geom_exit, :geographic => false, :srid => 4326, :has_z => false
      t.string :phone
      t.string :website
      t.string :detailed_pricing_model
      t.decimal :price, precision: 10, scale: 2
      t.string :currency
      t.string :available_payment_methods
      t.string :regular_openning_hours
      t.string :exceptions_opening
      t.string :flag
      t.st_polygon :the_geom_area

      t.timestamps
    end
  end
end
