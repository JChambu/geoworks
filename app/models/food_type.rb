class FoodType < ActiveRecord::Base
  has_many :pois
  belongs_to :poi_type

  before_destroy :has_related_pois?

  validates :name, :presence => true
  validates :poi_type_id, :presence => true

  delegate :name, :to => :poi_type, :prefix => true, :allow_nil => true

  def self.sorted_by_name
    self.order(:name)
  end

  def has_related_pois?
    unless Poi.where(:food_type_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end
end
