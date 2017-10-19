class CreateRegexpTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :regexp_types do |t|
      t.string :name
      t.string :expresion
      t.text :observations

      t.timestamps
    end
  end
end
