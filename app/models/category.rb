class Category < ActiveRecord::Base

  has_many :extended_listings

  def self.sorted_by_name
    self.order(:name)
  end

end
