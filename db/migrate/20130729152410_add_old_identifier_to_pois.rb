class AddOldIdentifierToPois < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :old_identifier, :integer
  end
end
