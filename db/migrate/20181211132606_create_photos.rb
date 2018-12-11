class CreatePhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :photos do |t|
      t.string :name
      t.text :image
      t.integer :project_type_id

      t.timestamps
    end
  end
end
