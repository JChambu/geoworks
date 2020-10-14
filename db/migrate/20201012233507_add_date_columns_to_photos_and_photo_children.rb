class AddDateColumnsToPhotosAndPhotoChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :photos, :gwm_created_at, :datetime
    add_column :photo_children, :gwm_created_at, :datetime
  end
end
