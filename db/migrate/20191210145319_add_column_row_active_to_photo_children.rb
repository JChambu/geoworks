class AddColumnRowActiveToPhotoChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :photo_children, :row_active, :boolean, default: true
  end
end
