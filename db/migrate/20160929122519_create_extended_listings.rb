class CreateExtendedListings < ActiveRecord::Migration[5.0]
  def change
    create_table :extended_listings do |t|
      t.string :name
      t.string :street
      t.integer :city_id
      t.integer :user_id
      t.integer :category_id
      t.point :the_geom
      t.timestamps
    end
  end
end
