class AddColumnChoiceListIdToProjectFields < ActiveRecord::Migration[5.0]
  def change
      add_column :project_fields, :choice_list_id, :integer
  end
end
