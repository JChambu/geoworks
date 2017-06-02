class GeoEdition < ApplicationRecord

  before_save :build_geom_line

  attr_accessor :line

  validates :poi_status_id, presence: true
  
  def build_geom_line

    if self.line and !self.line.to_s.empty?
      self.the_geom_segment = "LINESTRING(#{self.line})"
    end
  end
end
