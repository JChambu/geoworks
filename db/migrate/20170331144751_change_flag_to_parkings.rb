class ChangeFlagToParkings < ActiveRecord::Migration[5.0]
  def change
    remove_column :parkings, :flag 
   add_column :parkings, :flag, :boolean, default: false
  end
end
