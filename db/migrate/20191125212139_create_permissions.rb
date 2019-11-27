class CreatePermissions < ActiveRecord::Migration[5.1]
  def change
    create_table :permissions do |t|
      t.references :role, foreign_key: true
      t.references :event, foreign_key: true
      t.references :model_type, foreign_key: true

      t.timestamps
    end
  end
end
