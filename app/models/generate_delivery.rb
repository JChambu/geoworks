#encoding: utf-8
class GenerateDelivery < ActiveRecord::Base


  belongs_to :country
  
after_save :gen  

  def gen
    
      path = "/home/deliveries"
      directory = [path.to_s, Time.now.to_datetime.strftime("%d%m%Y")].join("/")
      @dir_exist = Navarra::Xls.dir_exist? directory
      FileUtils.mkdir(directory) if !@dir_exist

      #@name_view = Country.select(:name).where(id: country)
      @name_view = self.country.name

      case @name_view
      when "Argentina"
          view = "view_delivery_argentina"
      when "México"
          view = "view_delivery_mexico"
      when "Perú"
          view = "view_delivery_peru"
      when "Colombia"
          view = "view_delivery_colombia"
      when "Chile"
          view = "view_delivery_chile"
      when "Brasil"
          view = "view_delivery_brasil"
      else
          view = ""
      end

      system "ogr2ogr -f 'FileGDB' #{directory}/#{self.name}.gdb PG:dbname=navarra_latam user=postgres host=localhost -sql 'Select * from #{view} ' -nlt POINT " unless view.nil?

  end
  

end
