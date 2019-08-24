class CreateProjectStatuses < ActiveRecord::Migration[5.1]
  def change
    create_table :project_statuses do |t|
      t.string :name
      t.references :project_status, foreign_key: true

      t.timestamps
    end
  end
end
