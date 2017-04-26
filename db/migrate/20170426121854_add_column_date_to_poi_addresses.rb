class AddColumnDateToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_addresses, :birthdate, :date
  end
end
