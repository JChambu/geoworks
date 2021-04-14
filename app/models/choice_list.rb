class ChoiceList < ApplicationRecord
require 'csv'

  has_many :choice_list_items, ->{order(:name)}
  accepts_nested_attributes_for :choice_list_items, reject_if: lambda { |a| a[:name].blank? }, allow_destroy: true

  def to_csv
     CSV.generate(headers: true) do |csv|
       # header
       csv << [self.name]
       # data
       self.choice_list_items.each do |choice_list_item|
         csv << [choice_list_item.name]
       end
     end
   end

   def self.to_csv

      attributes = ChoiceList.select(:name)
      @at = []
      attributes.each do |a|
        @at << a.name
      end

      CSV.generate(headers: true) do |csv|
         csv << @at
         # data columns
         all.each do |choice_list|
           choice_list_items = []
           choice_list.choice_list_items.each do |choice_list_item|
             choice_list_items << choice_list_item.name
           end
           csv << choice_list_items
         end
       end

   end
end
