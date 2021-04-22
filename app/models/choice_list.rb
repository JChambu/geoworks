class ChoiceList < ApplicationRecord
  require 'csv'

  has_many :choice_list_items, ->{order(:name)}
  accepts_nested_attributes_for :choice_list_items, reject_if: lambda { |a| a[:name].blank? }, allow_destroy: true

  def self.import(file)
    headers = CSV.read(file.path, headers: true).headers
    headers.each do |cl_name|
      @choice_list = ChoiceList.create(name: cl_name)
      CSV.foreach(file.path, headers: true) do |row|
        data = row.to_hash
        if !data[cl_name].nil?
          @choice_list_item = @choice_list.choice_list_items.create(name: data[cl_name])
        end
      end
    end
  end
  
end
