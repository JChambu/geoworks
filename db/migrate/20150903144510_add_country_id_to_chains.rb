class AddCountryIdToChains < ActiveRecord::Migration[5.0]
  def change
        add_column :chains, :country_id, :integer
    
  end
end
