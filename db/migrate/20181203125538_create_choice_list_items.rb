class CreateChoiceListItems < ActiveRecord::Migration[5.1]
  def change
    create_table :choice_list_items do |t|
      t.string :name
      t.references :choice_list
      t.timestamps
    end
  end
end
