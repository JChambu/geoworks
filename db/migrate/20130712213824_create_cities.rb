class CreateCities < ActiveRecord::Migration[5.0]
  def change
    create_table :cities do |t|
      t.string :name
      t.integer :department_id
      t.string :name
      t.string :zip
      t.integer :proiority
      t.point :the_geom
      t.timestamps
    end
  end
end
