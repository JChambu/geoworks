class AddColumnsToAutomateStatuses < ActiveRecord::Migration[5.1]
  def change
    add_column :project_statuses, :status_type, :string
    add_column :project_statuses, :priority, :integer
    add_column :project_statuses, :timer, :string
    add_column :project_statuses, :inherit_project_type_id, :integer
    add_column :project_statuses, :inherit_status_id, :integer
    add_column :project_types, :level, :integer
  end
end
