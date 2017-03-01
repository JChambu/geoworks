class AddIdentifierHashToPois < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :identifier_hash, :string
  end
end
