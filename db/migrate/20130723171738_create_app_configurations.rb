class CreateAppConfigurations < ActiveRecord::Migration[5.0]
  def change
    create_table :app_configurations do |t|
      t.integer :gisworking_initial_identifier

      t.timestamps
    end
  end
end
