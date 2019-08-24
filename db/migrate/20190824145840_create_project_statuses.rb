class CreateProjectStatuses < ActiveRecord::Migration[5.1]
  def change
    create_table :project_statuses do |t|
      t.string :name
      t.references :project_type, foreign_key: true
      t.string :color

      t.timestamps
    end
  end
end
