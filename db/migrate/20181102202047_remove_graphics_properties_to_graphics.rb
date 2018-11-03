class RemoveGraphicsPropertiesToGraphics < ActiveRecord::Migration[5.1]
  def change
    remove_column :graphics, :graphics_property_id
  end
end
