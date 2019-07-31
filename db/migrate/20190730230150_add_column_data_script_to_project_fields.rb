class AddColumnDataScriptToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :data_script, :text
  end
end
