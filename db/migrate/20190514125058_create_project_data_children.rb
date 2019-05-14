class CreateProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    create_table :project_data_children do |t|
      t.jsonb :properties
      t.integer :project_id
      t.integer :project_field_id

      t.timestamps
    end
  end
end
