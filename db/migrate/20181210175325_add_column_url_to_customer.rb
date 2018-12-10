class AddColumnUrlToCustomer < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :url, :string
  end
end
