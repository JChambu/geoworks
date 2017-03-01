class AddColumnCodeToCategories < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_types, :code, :string
  end
end
