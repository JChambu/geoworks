class AddColumnPropertiesToGraphicsProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics, :stack, :boolean, default: :false
    add_column :graphics, :tick_x_min, :numeric
    add_column :graphics, :tick_x_max, :numeric
    add_column :graphics, :tick_y_min, :numeric
    add_column :graphics, :tick_y_max, :numeric
    add_column :graphics, :step_x, :numeric
    add_column :graphics, :substep_x, :numeric
    add_column :graphics, :data_labelling, :numeric
    add_column :graphics_properties, :left_y_axis, :boolean
    add_column :graphics_properties, :point_type, :string
  
  
  end
end
