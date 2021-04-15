class ChoiceList < ApplicationRecord

  has_many :choice_list_items, ->{order(:name)}
  accepts_nested_attributes_for :choice_list_items, reject_if: lambda { |a| a[:name].blank? }, allow_destroy: true

  def self.import(choice_list,choice_list_items)
    CSV.foreach(file.path, headers: true) do |row|
     choice_list.choice_list_items.create! row.to_hash
    end
  end

end
