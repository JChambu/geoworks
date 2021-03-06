class Role < ApplicationRecord
  include Roles::Scopes

  has_many :permissions, dependent: :destroy
  has_many :users
  has_many :user_customers
  accepts_nested_attributes_for :permissions, allow_destroy: true
  
  validates :name, presence: true
  validates :name, uniqueness: true

  def self.sorted_by_name
    self.order(:name)
  end

end
