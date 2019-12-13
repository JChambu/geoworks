class UserCustomer < ApplicationRecord

  belongs_to :user
  belongs_to :customer
  belongs_to :role

end
