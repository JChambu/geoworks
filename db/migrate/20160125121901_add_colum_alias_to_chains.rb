class AddColumAliasToChains < ActiveRecord::Migration[5.0]
  def change
    add_column :chains, :alias, :string

    Chain.find_each do |c|

      c.alias = c.name
      c.save!
    end
  end
end
