class Role < ApplicationRecord
  
  has_many :permissions, dependent: :destroy
  has_many :users
  has_many :user_customers
  accepts_nested_attributes_for :permissions, allow_destroy: true

  def self.sorted_by_name
    self.order(:name)
  end

end
