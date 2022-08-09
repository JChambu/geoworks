class ChangeDefaultValueForDataScript < ActiveRecord::Migration[5.1]
  def change
    change_column_default :project_fields, :data_script, ""
  end
end
