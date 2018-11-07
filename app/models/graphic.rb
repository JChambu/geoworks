class Graphic < ApplicationRecord
  has_many :graphics_properties
  belongs_to :dashboard

  accepts_nested_attributes_for :graphics_properties, allow_destroy: true
end
