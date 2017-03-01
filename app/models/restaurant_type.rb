class RestaurantType < ActiveRecord::Base

  has_many :pois

  def self.sorted_by_name
    self.order(:name)
  end
end
