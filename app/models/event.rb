class Event < ApplicationRecord
  
  has_many :permissions
  accepts_nested_attributes_for :permissions 

end
