class ChoiceList < ApplicationRecord

  has_many :choice_list_items, ->{order(:name)}
  accepts_nested_attributes_for :choice_list_items, reject_if: lambda { |a| a[:name].blank? }, allow_destroy: true
end
