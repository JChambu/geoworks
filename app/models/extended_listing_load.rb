class ExtendedListingLoad < ActiveRecord::Base


  require 'fileutils'

  belongs_to :city

  validate :file_exist?
  validate :is_file_type_valid?

#  before_create :restart_delayed_job
 # before_destroy :restart_delayed_job
  before_save :save_xls_file
  after_save :delay_load_extended_listings_form_xls

  attr_accessor :file


  XLS_COLUMNS=[
    :name,
    :address,
    :number,
    :category_name,
    :geom,
    :city,
    :department,
    :province,
    :country,
    :source,
    :phone,
    :user
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
    directory = Navarra::Xls.save(self.file, "extended_listings/loaded_xls", "led.xls")
    self.directory_name = directory.split("/").last
  end

  def self.get_xls_column_value column, xls_row
    index = XLS_COLUMNS.find_index column
    return nil unless index
    xls_row[index]
  end
  def delay_load_extended_listings_form_xls
    ExtendedListingLoad.extended_listing_load_xls(self.id)
  end

  def self.extended_listing_load_xls extended_listing_id
    extended_listing_load = ExtendedListingLoad.find(extended_listing_id)
    already_loaded_count = 0
    success_count = 0
    fail_count = 0
    contador = 0

    begin      
      Navarra::Xls.read(extended_listing_load.source_path) do |sheet, row|
        @r = row
        @s = sheet
        next if row.idx == 0 #The first row match with the column names
        @poi = ExtendedListingLoad.build_poi_address(row)

#        poi.address_complete = [[poi.street,  poi.number].join(' ' ), @city_name,  @country_name].compact.join ', '
        #@similarity_address = PoiAddress.similarity_address(poi.address_complete)
        # if @similarity_address.empty?
         # poi.the_geom = PoiAddressLoad.build_geom(poi.street, poi.number) 
        
        if @poi.save
            success_count += 1
            extended_listing_load.update_column(:success_count, success_count)
          else
            #extended_listings_load.write_error_file(poi.errors.messages, (row.idx + 1))
            fail_count += 1
            extended_listing_load.update_column(:fail_count, fail_count)
          end
     # else
     #       fail_count += 1
     #       poi_address_load.update_column(:fail_count, fail_count)
        
     # end
      end
      extended_listing_load.update_column(:status, :complete)
    rescue
      extended_listing_load.update_column(:status, :uncomplete)
    end
  end

  def write_error_file errors, row_number
    FileUtils.mkdir(self.errors_dir) unless File.exists?(self.errors_dir)
    File.open(self.errors_path , "a+") do |f|
      f.puts("Fila #{row_number} #{"*"*15}")
      errors.each do |key, values|
        f.puts("#{Poi.human_attribute_name(key, :default => "Error general ")}: #{values.join(", ")}\n")
      end


    end
  end
  def source_path
    return nil unless self.directory_name
    "#{self.source_dir}led.xls"
  end


  def source_dir
    "#{Rails.public_path.to_s}/extended_listings/loaded_xls/#{self.directory_name}/"
  end

  def self.empty_row? row
    identif = LoadLocation.get_xls_column_value(:country, row)
    (identif.nil? or identif.empty?)
  end

  def self.build_poi_address row
    poi_data = {}
    name = load_name(poi_data, row)
     street = load_street(poi_data, row)
     address = load_address(poi_data, row)
    number = load_number(poi_data, row)
    category = load_category(poi_data, row)
    country_id = load_poi_country(row)
    province_id = load_poi_province(country_id, row)
    department_id = load_poi_department(province_id, row)
    load_poi_city(poi_data, department_id, row)
    source= load_source(poi_data, row)
    phone= load_phone(poi_data, row)
    user= load_user(poi_data, row)
    #geom = build_geom(poi_data, address, number ) 
     the_geom = load_geom(poi_data, row)
    ExtendedListing.new(poi_data)
  end  


  def self.load_name(poi_data, row)
    name = ExtendedListingLoad.get_xls_column_value(:name, row)
    poi_data[:name] = name
  end
  
  def self.load_street(poi_data, row)
    street = ExtendedListingLoad.get_xls_column_value(:address, row)
    number  = ExtendedListingLoad.get_xls_column_value(:number, row)
    poi_data[:street] = [street, number].join (" ") 
 
  end
  
  def self.load_address(poi_data, row)
    street = ExtendedListingLoad.get_xls_column_value(:address, row)
    poi_data[:address_new] = street
  end
  
  def self.load_number(poi_data, row)
    number  = ExtendedListingLoad.get_xls_column_value(:number, row)
    poi_data[:number_new] = number
  end
  
  def self.load_poi_country row
    country_name = ExtendedListingLoad.get_xls_column_value(:country, row)
    country = Country.find_or_create_by_name(country_name.to_s)
    return nil unless country
    country.id
  end

  def self.load_poi_province(country_id, row)
    province_name = ExtendedListingLoad.get_xls_column_value(:province, row)
    province = Province.find_or_create_by_name_and_country_id(province_name.to_s, country_id)
    return nil unless province
    province.id
  end

  def self.load_poi_department(province_id, row)
    department_name = ExtendedListingLoad.get_xls_column_value(:department, row)
    department = Department.find_or_create_by_name_and_province_id(department_name.to_s, province_id)
    return nil unless department
    department.id
  end

  def self.load_poi_city(poi_data, department_id, row)
    city_name = ExtendedListingLoad.get_xls_column_value(:city, row)
    city = City.find_or_create_by_name_and_department_id(city_name.to_s, department_id)
    return nil unless city
    poi_data[:city_id] = city.id
  end


  def self.load_category(poi_data, row)
    category_name = ExtendedListingLoad.get_xls_column_value(:category_name, row)
    category = Category.find_or_create_by_name(category_name.to_s)
    poi_data[:category_original_id] =  category.category_original.to_i
    poi_data[:category_id] = category.id
  end

  # def self.load_city(poi_data, row)
  #   @city_name = ExtendedListing.get_xls_column_value(:city, row)
  #   @country_name = ExtendedListing.get_xls_column_value(:country, row)
  #   city = City.joins(department: [ province: [:country] ]).select('countries.name, cities.name as city_name').where("cities.name = ? and countries.name = ?", @city_name, @country_name ) 
  #
  #  @city = city
  #   pry 
  #   poi_data[:city_id] = city.id
  # end

  def self.load_source(poi_data, row)
    source = ExtendedListingLoad.get_xls_column_value(:source, row)
    poi_data[:source] = source
  end

  def self.load_phone(poi_data, row)
    phone = ExtendedListingLoad.get_xls_column_value(:phone, row)
    poi_data[:phone] = phone
  end


  def self.load_user(poi_data, row)
    user_id = ExtendedListingLoad.get_xls_column_value(:user, row)
    poi_data[:user_id] = user_id
  end
  
  def self.load_geom(poi_data, row)
    geom = ExtendedListingLoad.get_xls_column_value(:geom, row)
    poi_data[:the_geom] = geom
  end
  
  # def self.build_geom (address, number)
  #   #address = [address, number].join(' ')
  #   address_complete = [address, @city_name,  @country_name].compact.join ','
  #   address_complete
  #   geocode = Geocoder.coordinates(address_complete)
  #   if geocode.nil?
  #     the_geom = "POINT(10 11)"
  #   else
  #     the_geom = "POINT(#{geocode[1]} #{geocode[0]})"
  #   end
  #   #poi_data[:the_geom] = the_geom
  #    the_geom
  # end

end
