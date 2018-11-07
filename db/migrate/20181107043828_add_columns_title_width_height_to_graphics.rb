class AddColumnsTitleWidthHeightToGraphics < ActiveRecord::Migration[5.1]
  def change
      add_column :graphics, :title, :string 
      add_column :graphics, :width, :integer
      add_column :graphics, :height, :integer
  end
end
