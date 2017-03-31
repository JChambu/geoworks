class AddTheGeomAreaOriginalToParkings < ActiveRecord::Migration[5.0]
  def change
      
    add_column :parkings, :the_geom_area_original, :string
  
  end
end
