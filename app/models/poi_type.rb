class PoiType < ActiveRecord::Base
  has_many :chains
  has_many :food_types
  has_many :poi_sub_types
  has_many :pois

  validates :name, :presence => true

  before_destroy :can_destroy?

  def self.sorted_by_name
    self.order(:name)
  end

  def can_destroy?
  	result = []
  	result << has_related_resource?(Poi)
  	result << has_related_resource?(PoiSubType)
  	result << has_related_resource?(FoodType)
  	result << has_related_resource?(Chain)
  	!result.include? false
  end

  def has_related_resource? resource_class
    return true if resource_class.where(:poi_type_id => self.id).count.zero?
    self.errors.add(:base, "related_#{resource_class.model_downcase.pluralize}".to_sym)
    false
  end
end
