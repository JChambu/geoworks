class Role < ApplicationRecord
  
  has_many :permissions
  has_many :users
  accepts_nested_attributes_for :permissions 

  def self.sorted_by_name
    self.order(:name)
  end

end
