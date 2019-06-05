class AddColumnReadOnlyToProjectSubFields < ActiveRecord::Migration[5.1]
  def change
      add_column :project_subfields, :read_only, :boolean, default: false
  end
end
