class AddColumnDataScriptToProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_subfields, :data_script, :text
  end
end
