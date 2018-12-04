class ChangeColumnTypeIntegerChoiceListIdToProjectFields < ActiveRecord::Migration[5.1]
  def change
    
    rename_column :project_fields, :choice_list_id, :choice_list_key
    add_column :project_fields, :choice_list_id, :integer

  end
end
