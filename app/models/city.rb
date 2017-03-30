class City < ActiveRecord::Base
  belongs_to :department
  has_one :province, :through => :department
  has_one :country, :through => :province
  has_many :pois
  has_many :poi_addresses
  has_many :poi_address_load
  has_many :extended_listing
  has_many :parkings

  before_destroy :has_related_pois?

  delegate :name, :to => :department, :prefix => true, :allow_nil => true
  delegate :complete_name, :to => :department, :prefix => true, :allow_nil => true

  def self.sorted_by_name
    self.order(:name)
  end

  def self.filtered term, limit = nil, filter_attr = :name, format = :json
    @q = term.split(",")
    @department = @q[1]
    @province = @q[2]
    query = City.joins( department: :province ).where("cities.name  ILIKE '%#{@q[0]}%' and departments.name ilike '%#{@department}%' and provinces.name ilike '%#{@province}%'")


    query += query.limit(limit) if limit
    return query.map do |city|
      {value: city.id, text: city.complete_name}
    end.uniq if format == :json
    query
  end

  def complete_name

    values = []
    values << self.name if self.name
    values << self.department_complete_name if self.department_complete_name
    values.join(", ")
  end

  def has_related_pois?
    unless Poi.where(:city_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end  
end
