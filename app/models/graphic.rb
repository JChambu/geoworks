class Graphic < ApplicationRecord
  has_many :graphics_properties, dependent: :destroy
  belongs_to :dashboard

  accepts_nested_attributes_for :graphics_properties, allow_destroy: true
end
