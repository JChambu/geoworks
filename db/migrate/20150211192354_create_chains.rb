class CreateChains < ActiveRecord::Migration[5.0]
  def change
    create_table :chains do |t|
      t.string :name
      t.string :identifier
      t.integer :poi_type_id
      t.timestamps
    end
  end
end
