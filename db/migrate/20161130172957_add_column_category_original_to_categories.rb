class AddColumnCategoryOriginalToCategories < ActiveRecord::Migration[5.0]
  def change
    add_column :categories, :category_original, :integer
  end
end
