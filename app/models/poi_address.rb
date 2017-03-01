class PoiAddress < ActiveRecord::Base

  #include Navarra::Poi::Attributes
  include PgSearch 

  has_paper_trail
#  set_rgeo_factory_for_column(:the_geom, RGeo::Geographic.spherical_factory(:srid => 4326))
  
  belongs_to :city
  belongs_to :user
  belongs_to :p_action

  before_validation :build_geom
  before_save :build_geom
  
  #  validates :city_id, presence: true
  # validates :street, presence: true, if: "neighborhood.empty?"
  # validates :neighborhood, presence: true, if: "street.empty?"
  # validates :number, presence: true, if: "!street.empty?"
  # validates :block, :house, presence: true, if: "!neighborhood.empty?"


  delegate :complete_name, :to => :city, :prefix => true, :allow_nil => true
  delegate :name, :to => :user, :prefix => true, :allow_nil => true
  delegate :name, :to=> :p_action, :prefix => true, :allow_nil => true
  
  attr_accessor :latitude, :longitude

  pg_search_scope :similarity_address,
    :against => [:address_complete],
    :using => {
      :trigram => {
        :threshold => 0.91
      }
    }

    scope :total_validates, lambda {select("id, st_y(the_geom), st_x(the_geom), color") }


  def build_geom
    if self.latitude and self.longitude and
      !self.latitude.to_s.empty? and !self.longitude.to_s.empty?
      self.the_geom = "POINT(#{self.longitude} #{self.latitude})"
    end
  end

end
