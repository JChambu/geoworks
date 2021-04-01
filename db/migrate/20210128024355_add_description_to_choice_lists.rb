class AddDescriptionToChoiceLists < ActiveRecord::Migration[5.1]
  def change
    add_column :choice_lists, :description, :string
  end
end
