class AddTermsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :terms_accepted_at, :datetime
  end
end
