class AddIlikeColumnToProjectFilters < ActiveRecord::Migration[5.1]
  def change
    add_column :project_filters, :ilike, :boolean, default: false
  end
end
