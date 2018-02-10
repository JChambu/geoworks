class CreateAnalyticsDashboards < ActiveRecord::Migration[5.0]
  def change
    create_table :analytics_dashboards do |t|
      t.string :title
      t.string :description
      t.json :fields
      t.references :analysis_type, foreign_key: true
      t.references :chart, foreign_key: true
      t.boolean :chart
      t.boolean :card
      t.references :project_type, foreign_key: true
      t.timestamps
    end
  end
end
