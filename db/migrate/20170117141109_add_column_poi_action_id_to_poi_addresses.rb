class AddColumnPoiActionIdToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_addresses, :p_action_id, :integer
  
  end
end
