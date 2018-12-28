class Graphic < ApplicationRecord
  has_many :graphics_properties, dependent: :destroy
  belongs_to :dashboard
  belongs_to :chart

  accepts_nested_attributes_for :graphics_properties, allow_destroy: true


end
