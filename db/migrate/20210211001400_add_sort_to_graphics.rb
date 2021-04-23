class AddSortToGraphics < ActiveRecord::Migration[5.1]
  def change
    add_column :graphics, :sort, :integer
  end
end
