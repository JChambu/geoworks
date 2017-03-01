class AddPoiLoadIdToPois < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :poi_load_id, :integer
  end
end
