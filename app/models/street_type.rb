class StreetType < ActiveRecord::Base
  has_many :pois

  validates :name, presence: true, uniqueness: true
  before_destroy :has_related_pois?

  def self.sorted_by_name
    self.order(:name)
  end

  def has_related_pois?
    unless Poi.where(:street_type_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end
end
