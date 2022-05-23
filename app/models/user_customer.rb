class UserCustomer < ApplicationRecord

  belongs_to :user
  belongs_to :customer
  belongs_to :role

  validates :user_id, uniqueness: { scope: :customer_id, message: "No se puede almacenar usuarios con corporaciones iguales" }
end
