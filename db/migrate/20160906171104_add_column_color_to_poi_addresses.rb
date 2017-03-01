class AddColumnColorToPoiAddresses < ActiveRecord::Migration[5.0]
  def change

    add_column :poi_addresses, :color, :string
  end
end
