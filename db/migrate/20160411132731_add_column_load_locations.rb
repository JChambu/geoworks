class AddColumnLoadLocations < ActiveRecord::Migration[5.0]
  def change
 
    add_column :load_locations, :status, :string
    add_column :load_locations, :directory_name, :string
  end
end
