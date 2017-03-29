class Parking < ApplicationRecord


  before_validation :build_geom
  before_save :build_geom

  attr_accessor :latitude, :longitude, :latitude_entry, :longitude_entry, :latitude_exit, :longitude_exit

  def build_geom
    if self.latitude and self.longitude and
        !self.latitude.to_s.empty? and !self.longitude.to_s.empty?
        self.the_geom = "POINT(#{self.longitude} #{self.latitude})"
        self.the_geom_entrance = "POINT(#{self.longitude_entry} #{self.latitude_entry})"
        self.the_geom_exit = "POINT(#{self.longitude_exit} #{self.latitude_exit})"
    end
  end
end
