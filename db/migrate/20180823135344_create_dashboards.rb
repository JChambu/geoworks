class CreateDashboards < ActiveRecord::Migration[5.1]
  def change
    create_table :dashboards do |t|
      t.string :name
      t.references :project_type

      t.timestamps
    end
  end
end
