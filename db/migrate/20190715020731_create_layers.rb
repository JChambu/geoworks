class CreateLayers < ActiveRecord::Migration[5.1]
  def change
    create_table :layers do |t|
      t.string :name
      t.string :layer
      t.string :url
      t.text :description
      t.string :type_layer

      t.timestamps
    end
  end
end
