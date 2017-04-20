class AddColumnNoteToPoiAddresses < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_addresses, :note, :string
  end
end
