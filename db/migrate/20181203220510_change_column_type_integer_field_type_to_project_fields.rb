class ChangeColumnTypeIntegerFieldTypeToProjectFields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_fields, :field_type_id, :integer
  end
end
