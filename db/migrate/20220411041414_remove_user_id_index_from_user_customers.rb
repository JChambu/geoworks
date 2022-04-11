class RemoveUserIdIndexFromUserCustomers < ActiveRecord::Migration[5.1]
  def change
    remove_index :user_customers, name: "index_user_customers_on_user_id"
  end
end
