class Department < ActiveRecord::Base
  belongs_to :province
  has_one :country, :through => :province
  has_many :cities
  has_many :pois, :through => :cities
  has_many :poi_adresses, :through => :cities
  has_many :extended_listings, :through => :cities

  before_destroy :has_related_cities?

  validates :name, :presence => true
  validates :province_id, :presence => true

  delegate :name, :to => :province, :prefix => true, :allow_nil => true
  delegate :complete_name, :to => :province, :prefix => true, :allow_nil => true

  def complete_name
  	values = []
  	values << self.name if self.name
  	values << self.province_complete_name if self.province_complete_name
  	values.join(", ")
  end

  def has_related_cities?
    unless City.where(:department_id => self.id).count.zero?
      self.errors.add(:base, :related_cities)
      return false
    end
  end 
end
