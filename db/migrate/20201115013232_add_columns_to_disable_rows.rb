class AddColumnsToDisableRows < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :row_enabled, :boolean, default: :true
    add_column :projects, :disabled_at, :datetime
    add_column :project_data_children, :row_enabled, :boolean, default: :true
    add_column :project_data_children, :disabled_at, :datetime
    add_column :project_types, :enable_period, :string
  end
end
