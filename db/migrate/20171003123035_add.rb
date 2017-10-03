class Add < ActiveRecord::Migration[5.0]
  def change
      add_column :extended_listings, :street_3, :string
  
  end
end
