class AddColumnOwnerToProjectFilters < ActiveRecord::Migration[5.1]
  def change
    add_column :project_filters, :owner, :boolean, default: false
  end
end
