class AddColumnHiddenToProjectSubFields < ActiveRecord::Migration[5.1]
  def change
      add_column :project_subfields, :hidden, :boolean, default: false
  end
end
