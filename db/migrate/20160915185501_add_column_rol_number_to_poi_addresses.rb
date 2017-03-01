class AddColumnRolNumberToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_addresses, :rol_number, :string
  end
end
