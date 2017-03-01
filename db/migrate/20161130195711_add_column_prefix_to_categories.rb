class AddColumnPrefixToCategories < ActiveRecord::Migration[5.0]
  def change
    add_column :categories, :prefix, :boolean, default: false
  
  end
end
