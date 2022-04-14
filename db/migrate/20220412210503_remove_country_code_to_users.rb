class RemoveCountryCodeToUsers < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :country_code, :integer
  end
end
