class CreateGraphics < ActiveRecord::Migration[5.1]
  def change
    create_table :graphics do |t|
      t.references :analytics_dashboard, foreign_key: true
      t.references :graphics_property, foreign_key: true
      t.references :dashboard
      t.string :token

      t.timestamps
    end
  end
end
