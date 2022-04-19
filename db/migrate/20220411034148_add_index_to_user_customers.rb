class AddIndexToUserCustomers < ActiveRecord::Migration[5.1]
  def change
    add_index :user_customers, [:user_id, :customer_id], unique: true
  end
end
