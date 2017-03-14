class PoiStatus < ActiveRecord::Base
  has_many :pois
  has_many :extended_listings

  before_destroy :has_related_pois?


  def self.name_status name 
        PoiStatus.find_by(name: name)
end

def self.sorted_by_name
    self.order(:name)
  end

  def human_name
    PoiStatus.human_attribute_name self.name
  end

  def has_related_pois?
    unless Poi.where(:poi_status_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end
end
