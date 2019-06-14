class AddColumnPopupAttributeToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :popup, :boolean, default: false
  end
end
