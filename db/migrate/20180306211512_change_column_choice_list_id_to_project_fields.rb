class ChangeColumnChoiceListIdToProjectFields < ActiveRecord::Migration[5.0]
  def change
      change_column :project_fields, :choice_list_id, :string
  end
end
