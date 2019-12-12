class AddColumnRowActiveToPhotos < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :row_active, :boolean, default: true
  end
end
