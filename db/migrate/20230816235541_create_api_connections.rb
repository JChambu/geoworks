class CreateApiConnections < ActiveRecord::Migration[5.1]
  def change
    create_table :api_connections do |t|
      t.references :project_type, foreign_key: true
      t.string :url
      t.integer :interval
      t.boolean :automatic

      t.timestamps
    end
  end
end
