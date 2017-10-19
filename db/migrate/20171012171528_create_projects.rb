class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.jsonb :properties
      t.references :project_type, foreign_key: true
      t.timestamps
    end
  end
end
