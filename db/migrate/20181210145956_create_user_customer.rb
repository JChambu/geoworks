class CreateUserCustomer < ActiveRecord::Migration[5.1]
  def change
    create_table :user_customers do |t|
      t.references  :user
      t.references  :customer
      t.integer :role_id

      t.timestamps
    end
  end
end
