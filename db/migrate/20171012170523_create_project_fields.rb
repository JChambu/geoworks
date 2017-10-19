class CreateProjectFields < ActiveRecord::Migration[5.0]
  def change
    create_table :project_fields do |t|
      t.string :name
      t.string :field_type
      t.boolean :required
      t.boolean :cleasing_data
      t.boolean :georeferenced
      t.references :project_type, foreign_key: true
      t.integer :regexp_type_id

      t.timestamps
    end
  end
end
