class CreatePoiLoads < ActiveRecord::Migration[5.0]
  def change
    create_table :poi_loads do |t|
      t.string :name
      t.datetime :load_date
      t.string :status

      t.timestamps
    end
  end
end
