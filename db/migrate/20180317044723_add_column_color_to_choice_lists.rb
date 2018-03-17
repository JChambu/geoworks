class AddColumnColorToChoiceLists < ActiveRecord::Migration[5.0]
  def change
      add_column :choice_lists, :color, :string
  end
end
