class AddVerificationToPois < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :verification, :boolean, :default => false
  end
end
