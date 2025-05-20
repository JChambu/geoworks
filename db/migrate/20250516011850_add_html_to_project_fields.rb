class AddHtmlToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :html, :text
  end
end
