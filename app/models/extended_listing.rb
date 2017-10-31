class ExtendedListing < ActiveRecord::Base

  include PgSearch

  require 'rgeo/active_record/spatial_factory_store'

  belongs_to :city
  has_one :department, :through => :city
  has_one :province, :through => :department
  has_one :country, :through => :province
  belongs_to :category
  belongs_to :user
  belongs_to :poi_status
  belongs_to :poi_type
  belongs_to :poi_sub_type

  delegate :complete_name, :to => :city, :prefix => true, :allow_nil => true
  delegate :name, :to => :country, :prefix => true, :allow_nil => true
  delegate :name, :to => :province, :prefix => true, :allow_nil => true
  delegate :name, :to => :department, :prefix => true, :allow_nil => true
  delegate :name, :to => :city, :prefix => true, :allow_nil => true
  delegate :human_name, :to => :poi_status, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_sub_type, :prefix => true, :allow_nil => true
  delegate :name, :to => :poi_status, :prefix => true, :allow_nil => true
  #before_save :create_geom

  before_save :formated_strings
  validates :city_id, :name, :street,   presence: true
  # scope :duplicated, -> { where(hash_value: (ExtendedListing.select(:hash_value).group(:hash_value).having("count(hash_value) > 1"))).order(:name, :street)}

  attr_accessor :longitude, :latitude

  def formated_strings
    self.name = self.name.strip.titleize
    self.street = self.street.strip.titleize
  end

  #def self.build_geom (address, number, city_id)


  def self.congrated_point

    sql = "select a.the_geom, count(a.the_geom) as cantidad from extended_listings a ,
    (select st_buffer(the_geom, 0.000001) as the_geom from extended_listings group by the_geom ) as b  
    where st_contains(b.the_geom, a.the_geom) group by a.the_geom having count(a.the_geom) > 1 order by count(*) desc limit 20 "

    @congrated = ActiveRecord::Base.connection.execute(sql)

  end

  def self.buffer
  end



  def create_geom 

    if self.latitude and self.longitude and
        !self.latitude.to_s.empty? and !self.longitude.to_s.empty?
      self.the_geom = "POINT(#{self.longitude} #{self.latitude})"
    end
  end 

  def self.build_geom 

    @extended = ExtendedListing.where("poi_status_id = 2 ")
    @extended.each do |e|
      geom = ''
      #city = City.find(e.city_id) 
      #department = city.department
      province = e.province_name
      country = "Chile"
      #@address = [[e.address, e.number], city.name, department.name, province.name, country.name].join(', ')
      @address = [[e.street, e.number, e.street_2, e.street_3], province,  country].join(', ')

      geocode = Geocoder.coordinates(@address)
      geom = "POINT(#{geocode[1]} #{geocode[0]})" if !geocode.nil?
      e.update_attribute(:the_geom, geom )

    end
  end

  def self.find_possible_duplicates attributes
    q = self.scoped
    if attributes[:name].present?

      dictionary_terms = Term.by_names(attributes[:name].downcase.split).pluck(:name)
      terms = attributes[:name].downcase.split - dictionary_terms
      regex_str = String.new
      regex_str += "(\ |^)" + terms.join("(\ |$)|(\ |^)") + "(\ |$)|" unless terms.empty?
      regex_str += "^#{attributes[:name]}$"
      q = q.where("extended_listings.name ~* '#{regex_str}'")
      #q = q.where(:category_id => attributes[:category_id] )
      q = q.where(:city_id => attributes[:city_id]) if attributes[:city_id].present?
      pois = q.all.sort! do |a,b|
        (b.name.downcase.split & attributes[:name].downcase.split ).count <=> (a.name.downcase.split & attributes[:name].downcase.split ).count
      end
      return pois.first(5)
    end
    return nil
  end

=begin
  pg_search_scope :duplicated,
        :against => :name,
        :using => {
          :trigram => {
            :threshold => 0.7
          }
        }
=end

end
