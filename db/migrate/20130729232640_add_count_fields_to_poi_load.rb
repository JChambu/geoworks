class AddCountFieldsToPoiLoad < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_loads, :success_count, :integer
    add_column :poi_loads, :fail_count, :integer
    add_column :poi_loads, :already_loaded_count, :integer
    add_column :poi_loads, :directory_name, :string
  end
end
