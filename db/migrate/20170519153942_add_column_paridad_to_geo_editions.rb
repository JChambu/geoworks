class AddColumnParidadToGeoEditions < ActiveRecord::Migration[5.0]
  def change
    add_column :geo_editions, :paridad, :string
  end
end
