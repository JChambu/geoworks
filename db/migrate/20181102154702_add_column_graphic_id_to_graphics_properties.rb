class AddColumnGraphicIdToGraphicsProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics_properties, :graphic_id, :integer
  end
end
