class PoiStatus < ActiveRecord::Base
  has_many :pois
  has_many :extended_listings

  before_destroy :has_related_pois?

   # PoiStatus.all.each do |status|
   #  self.class.class_eval do
   #    method_name = "#{status.name.gsub(" ", "_").underscore}"
   #    define_method method_name do
   #      PoiStatus.find_by(name: status.name)
   #    end
   #  end
  # end

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
