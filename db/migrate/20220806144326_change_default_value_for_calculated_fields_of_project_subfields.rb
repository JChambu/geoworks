class ChangeDefaultValueForCalculatedFieldsOfProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    change_column_default :project_subfields, :calculated_field, ""
  end
end
