class AddColumnUserToPoiAddresses < ActiveRecord::Migration[5.0]
  def change

    add_column :poi_addresses, :user_id, :integer
    add_column :poi_addresses, :source, :string
 

  end
end
