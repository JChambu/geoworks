class AddLegendDisplayToGraphics < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics, :legend_display, :boolean, default: :false
  end
end
