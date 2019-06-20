class AddColumnRoleIdToUserCustomers < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :role_id, :integer
  end
end
