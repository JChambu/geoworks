class Province < ActiveRecord::Base
  belongs_to :country
  has_many :departments
  has_many :cities, :through => :departments
  has_many :pois, :through => :cities
  has_many :poi_addresses, :through => :cities
  has_many :extended_listings, :through => :cities
  
  before_destroy :has_related_departments?

  validates :name, :presence => true
  validates :country_id, :presence => true

  delegate :name, :to => :country, :prefix => true, :allow_nil => true

  def complete_name
  	values = []
  	values << self.name if self.name
  	values << self.country_name if self.country_name
  	values.join(", ")
  end

  def has_related_departments?
    unless Department.where(:province_id => self.id).count.zero?
      self.errors.add(:base, :related_departments)
      return false
    end
  end 
end
