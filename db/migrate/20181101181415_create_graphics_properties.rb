class CreateGraphicsProperties < ActiveRecord::Migration[5.1]
  def change
    create_table :graphics_properties do |t|
      t.string :color
      t.string :height
      t.string :width
      t.string :title
      t.references :chart

      t.timestamps
    end
  end
end
