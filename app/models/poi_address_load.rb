class PoiAddressLoad < ActiveRecord::Base

  require 'fileutils'

  belongs_to :city

  validate :file_exist?
  validate :is_file_type_valid?

  #before_create :restart_delayed_job
  #before_destroy :restart_delayed_job
  before_save :save_xls_file
  after_save :delay_load_poi_addresses_form_xls

  attr_accessor :file

  COLORS = {"Red" =>"Rojo", "blue" =>  "Azul", "#00FF00"=>"Verde" }

  XLS_COLUMNS=[
    :recid,
    :name,
    :address,
    :number,
    :city_name,
    :department_name,
    :province_name,
    :country_name,
    :source,
    :rol_number
  ]

  def initialize(*args)
    super(*args)
    self.status = :pending
  end

  def file_exist?
    if self.file.nil?
      self.errors.add(:base, :xls_does_not_exist)
      return false
    end
  end

  def error_file_exist?
    File.exists?(self.errors_path)
  end

  def is_file_type_valid?
    begin
      if (self.file.content_type == "application/xls" or self.file.content_type == "application/vnd.ms-excel")
        valid = self.file.content_type 
      end 
    rescue
      valid = false
    end

    self.errors.add(:base, :invalid_xls_type) unless valid
    valid
  end
  def restart_delayed_job
    system "cd #{Rails.root}; rake jobs:clear; bin/delayed_job restart;"
  end

  def remove_xls_file
    if self.source_file_exist?
      FileUtils.rm_rf(self.source_path)
    end    
  end

  def save_xls_file
    directory = Geoworks::Xls.save(self.file, "poi_addresses/loaded_xls", "poi_address.xls")
    self.directory_name = directory.split("/").last
  end

  def self.get_xls_column_value column, xls_row
    index = XLS_COLUMNS.find_index column
    return nil unless index
    xls_row[index]
  end
  def delay_load_poi_addresses_form_xls
    PoiAddressLoad.poi_address_load_xls(self.id)
  end

  def self.poi_address_load_xls poi_address_id
    poi_address_load = PoiAddressLoad.find(poi_address_id)
    already_loaded_count = 0
    success_count = 0
    fail_count = 0
    contador = 0

    begin      
      Geoworks::Xls.read(poi_address_load.source_path) do |sheet, row|
        @r = row
        @s = sheet
        next if row.idx == 0 #The first row match with the column names
        poi = PoiAddressLoad.build_poi_address(row)


        @poi = poi
        
        
        # poi.color = poi_address_load.color
        #city = City.joins(department: [ province: [:country] ]).select('countries.name, cities.name as city_name').find(poi.city_id) 

        #poi.address_complete = [[poi.street,  poi.number].join(' ' ), @city_name,  @country_name].compact.join ', '
        #@similarity_address = PoiAddress.similarity_address(poi.address_complete)

        # if @similarity_address.empty?
        # poi.the_geom = PoiAddressLoad.build_geom(poi.street, poi.number) 
        if poi.save
          success_count += 1
          poi_address_load.update_column(:success_count, success_count)
        else
          #        poi_load.write_error_file(poi.errors.messages, (row.idx + 1))
          fail_count += 1
          poi_address_load.update_column(:fail_count, fail_count)
        end
        # else
        #       fail_count += 1
        #       poi_address_load.update_column(:fail_count, fail_count)

        # end
      end
      poi_address_load.update_column(:status, :complete)
    rescue
      poi_address_load.update_column(:status, :uncomplete)
    end
  end

  def source_path
    return nil unless self.directory_name
    "#{self.source_dir}poi_address.xls"
  end


  def source_dir
    "#{Rails.public_path.to_s}/poi_addresses/loaded_xls/#{self.directory_name}/"
  end

  def self.empty_row? row
    identif = LoadLocation.get_xls_column_value(:country, row)
    (identif.nil? or identif.empty?)
  end

  def self.build_poi_address row
    poi_data = {}
    #address = validate_address(poi_data, row)
    # load_address_number(poi_data, row)
    rec_id = load_recid(poi_data, row)
    name = load_name(poi_data, row)
    address = load_address(poi_data, row) 
    address_original = load_address_original(poi_data, row) 
    number  = load_number(poi_data, row) 
    city = load_city(poi_data, row)
    #  country = load_country(poi_data, row)
    #  source= load_source(poi_data, row)
    #  rol_number= load_rol_number(poi_data, row)
#    geom = build_geom(poi_data, address, number ) 
   
    PoiAddress.new(poi_data)

  end  



  def self.load_address_original(poi_data, row)
    address_row = PoiAddressLoad.get_xls_column_value(:address, row).strip.capitalize
    poi_data[:address_complete] = address_row
  end
    
  def self.street_expresion address

      address_row = address.gsub(/\s(of[\.|\+|\*].*)/, '')
      address_row = address.gsub(/\s(int[\.|\+|\*].*)/, '')
      address_row = address.gsub(/\s(cdra[\.|\+|\*].*)/, 'cuadra ')
      address_row = address.gsub(/\s(sub[\.|\+|\*].*)/, '')
      return address_row
    end
  
  
  
  def self.load_address(poi_data, row)
    address_row = PoiAddressLoad.get_xls_column_value(:address, row).strip.capitalize
  
    if address_row.nil?
      poi_data[:note] = "Sin nombre de calle"
      return
    end
      address_row = PoiAddressLoad.street_expresion(address_row) 
    
    exp_address = /(.*)\s+\d/ 
    address = exp_address.match(address_row)

    if address.nil?
      poi_data[:street] = address_row
    else
      poi_data[:street] = address[1]
      return address[1]
    end

  end

  def self.load_number(poi_data, row)
    number_row = PoiAddressLoad.get_xls_column_value(:address, row).strip
    number_row = PoiAddressLoad.street_expresion(number_row)
    exp_number = /.*\s(\d+)/
    number = exp_number.match(number_row)

    if number.nil?
      poi_data[:number] = nil
      poi_data[:note] = "Sin numero de calle"
    else  
      poi_data[:number] = number[1]
      return number[1]
    end
  end

  def self.load_city(poi_data, row)
    @city_name = PoiAddressLoad.get_xls_column_value(:city_name, row)
    @department_name = PoiAddressLoad.get_xls_column_value(:department_name, row)
    @province_name = PoiAddressLoad.get_xls_column_value(:province_name, row)
    @country_name = PoiAddressLoad.get_xls_column_value(:country_name, row)
    poi_data[:city_name] = @city_name
    poi_data[:department_name] = @department_name
    poi_data[:province_name] = @province_name
    poi_data[:country_name] = @country_name

  end

  def self.load_country (poi_data, row)
    @country_name = PoiAddressLoad.get_xls_column_value(:country, row)
  end

  def self.load_source(poi_data, row)
    source = PoiAddressLoad.get_xls_column_value(:source, row)
    poi_data[:source] = source
  end

  def self.load_rol_number(poi_data, row)
    rol_number = PoiAddressLoad.get_xls_column_value(:rol_number, row)
    poi_data[:rol_number] = rol_number
  end

  def self.load_recid(poi_data, row)
    recid = PoiAddressLoad.get_xls_column_value(:recid, row)
     poi_data[:recid] = recid
    
  end

  def self.load_name(poi_data, row)
    name = PoiAddressLoad.get_xls_column_value(:name, row)
     poi_data[:name] = name
  end


  def self.build_geom(poi_data, address, number)
    address = [address, number].join(' ')
    address_complete = [address, [@city_name, @department_name, @province_name, @country_name].join(' ')].join(',')
    geocode = Geocoder.coordinates(address_complete)
    if !geocode.nil?
      geom = "POINT(#{geocode[1]} #{geocode[0]})"
      poi_data[:the_geom] = geom
    end
  end
end
