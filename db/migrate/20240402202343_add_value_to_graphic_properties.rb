class AddValueToGraphicProperties < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics_properties, :value, :boolean, default: false
  end
end
