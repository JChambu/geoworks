class CreateProjectStatusRules < ActiveRecord::Migration[5.1]
  def change
    create_table :project_status_rules do |t|
      t.references :project, foreign_key: true
      t.string :json_key
      t.string :trigger_value
      t.references :project_status, foreign_key: true
    end
  end
end
