class AddAreaCodeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :area_code, :string
  end
end
