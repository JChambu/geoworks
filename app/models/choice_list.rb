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

  def self.to_csv_all

     # Busca los nombres de los listados para la cabecera del csv
      choice_lists = ChoiceList.select(:name).order(:name)
      @headers = []
      choice_lists.each do |a|
       @headers << a.name
      end

      CSV.generate(headers: true) do |csv|
       csv << @headers

       # Arma un objeto con todos los listados y sus items
       cl_all = {}
       all.order(:name).each do |choice_list|
         choice_list_items = []
         choice_list.choice_list_items.each do |choice_list_item|
           choice_list_items << choice_list_item.name
         end
         cl_all[choice_list.name] = choice_list_items
       end

       # Busca el listado con mayor cantidad de items
       sql = 'SELECT MAX(a.num) FROM (SELECT COUNT(*) num FROM choice_list_items GROUP BY choice_list_id) a'
       max = ActiveRecord::Base.connection.execute(sql)

       # Cicla el objeto y carga las filas del csv ordenadas
       n = 0
        loop do
          row = []
          cl_all.each do |list, items|
            row << items[n]
          end
          csv << row
          n += 1
          break if n > max.getvalue(0,0)
        end
      end
  end
end
