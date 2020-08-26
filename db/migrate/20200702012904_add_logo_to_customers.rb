class AddLogoToCustomers < ActiveRecord::Migration[5.1]
  def change
    add_column :customers, :logo, :text
  end
end
