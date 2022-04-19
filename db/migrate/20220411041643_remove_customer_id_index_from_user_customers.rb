class RemoveCustomerIdIndexFromUserCustomers < ActiveRecord::Migration[5.1]
  def change
    remove_index :user_customers, name: "index_user_customers_on_customer_id"
  end
end
