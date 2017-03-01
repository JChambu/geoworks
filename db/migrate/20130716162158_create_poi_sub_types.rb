class CreatePoiSubTypes < ActiveRecord::Migration[5.0]
	 def change
    create_table :poi_sub_types do |t|
      t.string :name
      t.integer :poi_type_id

      t.timestamps
    end
  end
end
