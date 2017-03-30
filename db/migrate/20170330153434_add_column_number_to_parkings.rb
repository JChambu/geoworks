class AddColumnNumberToParkings < ActiveRecord::Migration[5.0]
  def change
    add_column :parkings, :number, :integer
  
  end
end
