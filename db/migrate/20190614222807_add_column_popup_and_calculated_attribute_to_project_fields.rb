class AddColumnPopupAndCalculatedAttributeToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :popup, :boolean, default: false
    add_column :project_fields, :calculated_field, :string
    add_column :project_subfields, :popup, :boolean, default: false
    add_column :project_subfields, :calculated_field, :string
  end
end
