class AddColumnIdentifierToExtendedListings < ActiveRecord::Migration[5.0]
  def change
    add_column :extended_listings, :identifier, :serial

    execute('ALTER SEQUENCE extended_listings_identifier_seq restart with 100000000')
  end
end
