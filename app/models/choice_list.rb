class ChoiceList < ApplicationRecord
  require 'csv'

  has_many :choice_list_items, ->{order(:name)}
  accepts_nested_attributes_for :choice_list_items, reject_if: lambda { |a| a[:name].blank? }, allow_destroy: true

  def self.import(file)
    p = 0
    CSV.foreach(file.path, headers: true) do |row|
      all_key = []
      all_key = row.to_hash
      all_key.each do |list, it|
        if p < 1
          @choice_list = ChoiceList.new
          @choice_list.name = list
          @choice_list_item = @choice_list.choice_list_items.new
          @choice_list_item.name = it
          @choice_list.save
        elsif p >= 1
          @choice_list_item = @choice_list.choice_list_items.new
          @choice_list_item.name = it
          @choice_list_item.save
        end
      end
      p += 1
    end
  end
end
