class UserCustomer < ApplicationRecord

  belongs_to :user
  belongs_to :customer
  belongs_to :role
  has_many :project_filters, through: :user, dependent: :destroy
  accepts_nested_attributes_for :project_filters, allow_destroy: true

  validates :user_id, uniqueness: { scope: :customer_id, message: "No se puede almacenar usuarios con corporaciones iguales" }
end
