class CreateProjectFilters < ActiveRecord::Migration[5.1]
  def change
    create_table :project_filters do |t|
      t.jsonb :properties
      t.references :user, null: false, foreign_key: true
      t.references :project_type, null: false, foreign_key: true
      t.integer :lock_version, null: false, default: 0

      t.timestamps
    end
  end
end
