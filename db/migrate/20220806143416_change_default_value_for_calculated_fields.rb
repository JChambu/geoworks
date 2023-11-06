class ChangeDefaultValueForCalculatedFields < ActiveRecord::Migration[5.1]
  def change
    change_column_default :project_fields, :calculated_field, ""
  end
end
