class CreateChoiceLists < ActiveRecord::Migration[5.0]
  def change
    create_table :choice_lists do |t|
      t.string :name
      t.string :key
      t.string :value
      t.string :label

      t.timestamps
    end
  end
end
