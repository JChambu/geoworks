class CreatePoiAddressLoads < ActiveRecord::Migration[5.0]
  def change
    create_table :poi_address_loads do |t|
      t.string :name
      t.string :status
      t.string :directory_name

      t.timestamps
    end
  end
end
