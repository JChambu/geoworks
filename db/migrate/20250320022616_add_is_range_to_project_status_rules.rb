class AddIsRangeToProjectStatusRules < ActiveRecord::Migration[5.1]
  def change
    add_column :project_status_rules, :is_range, :boolean
  end
end
