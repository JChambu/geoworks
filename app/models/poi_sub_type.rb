class PoiSubType < ActiveRecord::Base
  belongs_to :poi_type
  has_many :pois
  has_many :extended_listings

  validates :name, :presence => true
  validates :poi_type_id, :presence => true

  before_destroy :has_related_pois?

  delegate :name, :to => :poi_type, :prefix => true, :allow_nil => true

  def self.sorted_by_name
    self.order(:name)
  end

  def has_related_pois?
    unless Poi.where(:poi_sub_type_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end
end
