class ChangeDefaultValueForDataScriptOfProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    change_column_default :project_subfields, :data_script, ""
  end
end
