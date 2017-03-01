class AddObjetiveToChains < ActiveRecord::Migration[5.0]
  def self.up
    add_column :chains, :objetive, :integer , default: 0 
  end

  def self.down
    remove_column :chains, :objetive
  end
end
