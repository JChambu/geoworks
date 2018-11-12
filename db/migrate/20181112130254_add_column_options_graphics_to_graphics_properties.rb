class AddColumnOptionsGraphicsToGraphicsProperties < ActiveRecord::Migration[5.1]
  def change
      add_column :graphics, :label_x_axis, :string  
      add_column :graphics, :label_y_axis_left, :string
      add_column :graphics, :label_y_axis_right, :string
      add_column :graphics_properties, :label_datasets, :string 
  end
end
