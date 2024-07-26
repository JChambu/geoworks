class AddEmailSendedToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :email_sended, :boolean, default: false
  end
end
