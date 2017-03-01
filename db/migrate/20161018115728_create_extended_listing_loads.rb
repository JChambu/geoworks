class CreateExtendedListingLoads < ActiveRecord::Migration[5.0]
  def change
    create_table :extended_listing_loads do |t|
      t.string :name
      t.string :status
      t.integer :success_count
      t.integer :fail_count
      t.integer :already_loaded_count
      t.string :directory_name

      t.timestamps
    end
  end
end
