class RemoveSortFromGraphics < ActiveRecord::Migration[5.1]
  def change
    remove_column :graphics, :sort, :integer
  end
end
