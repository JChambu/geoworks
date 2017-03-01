class PoiSource < ActiveRecord::Base
  has_many :pois

  validates :name, presence: true, uniqueness: true
  before_destroy :has_related_pois?

  PoiSource.all.each do |source|
    self.class.class_eval do
      method_name = "#{source.name.gsub(" ", "_").underscore}"
      define_method method_name do
        PoiSource.find_by(name: source.name)
      end
    end
  end

  def self.sorted_by_name
    self.order(:name)
  end

  def has_related_pois?
    unless Poi.where(:poi_source_id => self.id).count.zero?
      self.errors.add(:base, :related_pois)
      return false
    end
  end
end
