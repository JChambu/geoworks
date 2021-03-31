class ChoiceList < ApplicationRecord
require 'csv'

  has_many :choice_list_items, ->{order(:name)}
  accepts_nested_attributes_for :choice_list_items, reject_if: lambda { |a| a[:name].blank? }, allow_destroy: true

  # def self.to_csv
  #   attributes = %w{ id name key value label created_at updated_at color }
  #   CSV.generate(headers: true) do |csv|
  #     csv << attributes
  #     all.each do |choice_list|
  #       csv << choice_list.attributes.values_at(*attributes)
  #     end
  #   end
  # end
  def self.to_csv
      choice_list = ChoiceList.all
      CSV.generate(headers: true) do |csv|
        csv << choice_list
        # data columns
        all.each do |choice_list|
          choice_list_items = []
          choice_list.choice_list_items.each do |choice_list_item|
            choice_list_items << choice_list_item.name
          end
        csv << choice_list_items.presence
        end
      end
  end

end
