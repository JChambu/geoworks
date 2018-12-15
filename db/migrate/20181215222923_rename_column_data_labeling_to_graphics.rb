class RenameColumnDataLabelingToGraphics < ActiveRecord::Migration[5.1]
  def change
      
      remove_column :graphics, :data_labelling
      add_column :graphics, :data_labelling, :boolean, default: :false
  
  end
end
