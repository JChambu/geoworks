class AddColumnIdentifierToPoiSubTypes < ActiveRecord::Migration[5.0]
  def change
    add_column :poi_sub_types, :identifier, :integer
  end
end
