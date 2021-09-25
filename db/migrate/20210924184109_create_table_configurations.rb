class CreateTableConfigurations < ActiveRecord::Migration[5.1]
  def change
    create_table :table_configurations do |t|
      t.string :name
      t.jsonb :config
      t.integer :project_type_id
      t.integer :user_id

      t.timestamps
    end
    add_index :table_configurations, :project_type_id
    add_index :table_configurations, :user_id
  end
end
