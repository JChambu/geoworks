class Event < ApplicationRecord
  
  has_many :permissions
  has_many :roles, through: :permissions
  has_many :model_types, through: :permissions
  accepts_nested_attributes_for :permissions, allow_destroy: true
end
