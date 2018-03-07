class ChangeColumnValueToChoiceLists < ActiveRecord::Migration[5.0]
  def change
    
    change_column :choice_lists, :value, :string
  
  end
end
