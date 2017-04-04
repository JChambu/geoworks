class AddLineToParkings < ActiveRecord::Migration[5.0]
  def change
  
      add_column :parkings, :the_geom_segment, :line_string
  
  end
end
