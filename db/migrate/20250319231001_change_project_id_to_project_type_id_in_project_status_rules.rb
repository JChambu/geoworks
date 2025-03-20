class ChangeProjectIdToProjectTypeIdInProjectStatusRules < ActiveRecord::Migration[5.1]
  def change
    remove_column :project_status_rules, :project_id, :integer
    add_column :project_status_rules, :project_type_id, :integer
    add_index :project_status_rules, :project_type_id
  end
end
