class Parking < ApplicationRecord


  
  belongs_to :user
  belongs_to :city
  
  
  before_validation :build_geom
  before_save :build_geom
  before_save :build_geom_polygon

  delegate :name, :to => :user, :prefix => true, :allow_nil => true
  
  attr_accessor :latitude, :longitude, :latitude_entry, :longitude_entry, :latitude_exit, :longitude_exit, :polygon

  
  validates :name, presence: true
  
  
  
  def build_geom
    if self.latitude and self.longitude and
        !self.latitude.to_s.empty? and !self.longitude.to_s.empty?
      self.the_geom = "POINT(#{self.longitude} #{self.latitude})"
      self.the_geom_entrance = "POINT(#{self.longitude_entry} #{self.latitude_entry})"
      self.the_geom_exit = "POINT(#{self.longitude_exit} #{self.latitude_exit})"
    end
  end

  def build_geom_polygon

    if self.polygon and !self.polygon.to_s.empty?
      self.the_geom_area = "POLYGON((#{self.polygon}))"
    end
  end


  def self.find_possible_duplicates attributes
    q = self.where(nil)
				if attributes[:name].present?
					dictionary_terms = Term.by_names(attributes[:name].downcase.split).pluck(:name)
					terms = attributes[:name].downcase.split - dictionary_terms
					regex_str = String.new
					regex_str += "(\ |^)" + terms.join("(\ |$)|(\ |^)") + "(\ |$)|" unless terms.empty?
					regex_str += "^#{attributes[:name]}$"
					q = q.where("parkings.name ~* '#{regex_str}'")
          
					pois = q.all.sort  do |a,b|
						(b.name.downcase.split & attributes[:name].downcase.split ).count <=> (a.name.downcase.split & attributes[:name].downcase.split ).count
					end
					return pois.first(5)
				end
				return nil
			end




end
