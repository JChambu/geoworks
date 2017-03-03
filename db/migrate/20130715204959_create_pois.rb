class CreatePois < ActiveRecord::Migration[5.0]
  def change
    create_table :pois do |t|
      t.string :name
      t.string :short_name
      t.string :website
      t.string :email
      t.string :second_email
      t.text :note
      t.string :cel_number
      t.string :phone
      t.string :second_phone
      t.string :fax
      t.string :house_number
      t.text :contact
      t.integer :priority
      t.text :location
      t.integer :city_id
      t.integer :chain_id
      t.integer :food_type_id
      t.integer :poi_source_id
      t.integer :poi_type_id
      t.integer :poi_sub_type_id
      t.string :street_name
      t.integer :street_type_id
      t.integer :user_id
      t.integer :poi_status_id      
      t.boolean :active, default: true
      t.boolean :deleted, default: false
      t.integer :duplicated_identifier
      t.integer :identifier
      t.date :control_date
      t.st_point :the_geom, :geographic => false, :srid => 4326, :has_z => false

      t.timestamps
    end

    #change_table :pois do |t|
     # t.index :the_geom, :spatial => true
    #end
  end
end
