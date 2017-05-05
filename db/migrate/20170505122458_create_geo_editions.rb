class CreateGeoEditions < ActiveRecord::Migration[5.0]
  def change
    create_table :geo_editions do |t|
      t.string :name
      t.string :street
      t.string :number
      t.string :address
      t.string :company
      t.integer :city
      t.integer :recid
      t.string :number_door_start_original
      t.string :number_door_start
      t.string :number_door_end_original
      t.string :number_door_end 
      t.string :code
      t.point :the_geom, :geographic => false, :srid => 4326, :has_z => false
      t.line :the_geom_segment, :geographic => false, :srid => 4326, :has_z => false
      t.line :the_geom_segment_original, :geographic => false, :srid => 4326, :has_z => false
    
      t.timestamps
    end
  end
end
