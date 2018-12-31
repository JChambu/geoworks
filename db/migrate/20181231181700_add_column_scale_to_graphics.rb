class AddColumnScaleToGraphics < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics, :scale, :numeric, default: 1
  end
end
