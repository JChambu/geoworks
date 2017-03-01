class CreatePActions < ActiveRecord::Migration[5.0]
  def change
    create_table :p_actions do |t|
      t.string :name

      t.timestamps
    end
  end
end
