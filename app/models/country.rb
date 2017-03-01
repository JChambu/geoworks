class Country < ActiveRecord::Base
  has_many :provinces
  has_many :chains
  has_many :departments, :through => :provinces
  has_many :cities, :through => :departments
  has_many :pois, :through => :cities
  has_many :poi_addresses, :through => :cities
  has_many :extended_listings, :through => :cities
  has_many :generate_deliveries

  before_destroy :has_related_provinces?

  validates :name, :presence => true

  def self.sorted_by_name
    self.order(:name)
  end

  def has_related_provinces?
    unless Province.where(:country_id => self.id).count.zero?
      self.errors.add(:base, :related_provinces)
      return false
    end
  end   

def  to_s
  name
end

end
