class CreatePhotoChildren < ActiveRecord::Migration[5.1]
  def change
    create_table :photo_children do |t|
      t.string :name
      t.text :image
      t.references :project_data_child, foreign_key: true

      t.timestamps
    end
  end
end
