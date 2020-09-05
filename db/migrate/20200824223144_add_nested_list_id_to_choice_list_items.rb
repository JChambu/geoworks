class AddNestedListIdToChoiceListItems < ActiveRecord::Migration[5.1]
  def change
    add_column :choice_list_items, :nested_list_id, :integer
  end
end
