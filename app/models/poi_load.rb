class PoiLoad < ActiveRecord::Base
  require 'fileutils'
  has_many :pois

  validates :name, presence: true, uniqueness: true
  validates :load_date, presence: true
  validates :status, presence: true
  validate :file_exist?
  validate :is_file_type_valid?

  before_create :restart_delayed_job
  before_destroy :restart_delayed_job
  before_destroy :remove_xls_file
  before_destroy :remove_error_file
  after_destroy :remove_unused_lookup_data
  before_save :save_xls_file
  after_save :delay_load_pois_form_xls

  attr_accessor :file

  def self.ordered_by_load_date
    self.order("load_date desc")
  end

  XLS_COLUMNS =[
    :identifier,
    :type,
    :sub_type,
    :name,
    :street_name,
    :street_type,
    :house_number,
    :country,
    :province,
    :department,
    :city,
    :chain,
    :chain_identifier,
    :food_type,
    :phone,
    :email,
    :website,
    :zip,
    :lat,
    :lon,
    :priority,
    :old_identifier,
    :last_update
  ]

  def initialize(*args)
    super(*args)
    self.status = :pending
    self.load_date = Time.now
  end

  def source_path
    return nil unless self.directory_name
    "#{self.source_dir}pois.xls"
  end

  def errors_path
    return nil unless self.directory_name
    "#{self.errors_dir}errors.txt"
  end

  def error_file_exist?
    File.exists?(self.errors_path)
  end

  def source_file_exist?
    File.exists?(self.source_path)
  end

  def source_dir
    "#{Rails.public_path.to_s}/poi/loaded_xls/#{self.directory_name}/"
  end

  def errors_dir
    "#{Rails.public_path.to_s}/poi/error_xls/#{self.directory_name}/"
  end

  def remove_xls_file
    if self.source_file_exist?
      FileUtils.rm_rf(self.source_path)
    end    
  end

  def remove_error_file
    if self.error_file_exist?
      FileUtils.rm_rf(self.errors_path)
    end
  end

  def save_xls_file
    directory = Geoworks::Xls.save(self.file, "poi/loaded_xls", "pois.xls")
    self.directory_name = directory.split("/").last
    self.success_count = 0
    self.fail_count = 0
    self.already_loaded_count = 0    
  end

  def delay_load_pois_form_xls
    PoiLoad.delay.load_pois_form_xls(self.id)
  end

  def restart_delayed_job
    system "cd #{Rails.root}; rake jobs:clear; bin/delayed_job restart;"
  end

  def remove_unused_lookup_data
    Poi.where(:poi_load_id => self.id).destroy_all
    City.destroy_all
    Department.destroy_all
    Province.destroy_all
    Country.destroy_all
    FoodType.destroy_all
    Chain.destroy_all
    PoiSubType.destroy_all
    PoiType.destroy_all
    StreetType.destroy_all
  end

  def self.load_pois_form_xls poi_load_id
    poi_load = PoiLoad.find(poi_load_id)
    already_loaded_count = 0
    success_count = 0
    fail_count = 0
    contador = 0

begin      
      Geoworks::Xls.read(poi_load.source_path) do |sheet, row|
       
        next if row.idx == 0 #The first row match with the column names
        if PoiLoad.empty_row? row
          poi_load.update_column(:status, :complete)      
          return
        end

       # if PoiLoad.poi_already_loaded? row
        #  already_loaded_count += 1
        #  poi_load.update_column(:already_loaded_count, already_loaded_count)
        #else
        
        poi = PoiLoad.build_poi(row, poi_load.id)
  
           if poi.save
            success_count += 1
            poi_load.update_column(:success_count, success_count)
          else
            poi_load.write_error_file(poi.errors.messages, (row.idx + 1))
            fail_count += 1
            poi_load.update_column(:fail_count, fail_count)
          end
        #end
      end
 contador +=1 
      poi_load.update_column(:status, :complete)
    rescue
      poi_load.update_column(:status, :uncomplete)
    end
  end

  def write_error_file errors, row_number
    FileUtils.mkdir(self.errors_dir) unless File.exists?(self.errors_dir)
    File.open(self.errors_path , "a+") do |f|
      f.puts("Fila #{row_number} #{"*"*15}")
      errors.each do |key, values|
        f.puts("#{Poi.human_attribute_name(key, :default => "Error general")}: #{values.join(", ")}\n")
      end
    end
  end

  def self.empty_row? row
    identif = formatted_identifier(row)
    (identif.nil? or identif.empty?)
  end

  def self.poi_already_loaded? row
    !Poi.find_by_identifier(formatted_identifier(row)).nil?
  end

  def self.build_poi row, poi_load_id
    poi_data = {}
    #load_poi_identifier(poi_data, row) #Descomentar para que rails construya el identifier

    poi_type_id = load_poi_type(poi_data, row)
    load_poi_sub_type(poi_data, poi_type_id, row)
    load_poi_chain(poi_data, poi_type_id, row)
    load_poi_food_type(poi_data, poi_type_id, row)
    load_poi_street_type(poi_data, row)
    country_id = load_poi_country(row)
    province_id = load_poi_province(country_id, row)
    department_id = load_poi_department(province_id, row)
    load_poi_city(poi_data, department_id, row)
    load_geometry(poi_data, row)
    load_poi_old_identifier(poi_data, row)
    load_poi_name(poi_data, row)
    load_poi_street_name(poi_data, row)    
    load_poi_house_number(poi_data, row)
    load_poi_phone(poi_data, row)
    load_poi_email(poi_data, row)
    load_poi_website(poi_data, row)    
    load_poi_priority(poi_data, row)    
    load_poi_last_update(poi_data, row)    

    poi_data[:poi_status_id] = PoiStatus.not_validated.id
    poi_data[:poi_source_id] = PoiSource.navteq.id
    poi_data[:active] = true
    poi_data[:deleted] = false
    poi_data[:poi_load_id] = poi_load_id

    Poi.new(poi_data)
  end

  def self.get_xls_column_value column, xls_row
    index = XLS_COLUMNS.find_index column
    return nil unless index
    xls_row[index]
  end

  def file_exist?
    if self.file.nil?
      self.errors.add(:base, :xls_does_not_exist)
      return false
    end
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

  def human_status
    I18n.t("poi_load_statuses.#{self.status.downcase}")
  end

  def self.load_poi_type(poi_data, row)
    poi_type_name = PoiLoad.get_xls_column_value(:type, row)
    poi_type = PoiType.find_or_create_by(name: poi_type_name.to_s)
    return nil unless poi_type
    poi_data[:poi_type_id] = poi_type.id
    poi_type.id
  end

  def self.load_poi_sub_type(poi_data, poi_type_id, row)
    poi_sub_type_name = PoiLoad.get_xls_column_value(:sub_type, row)
    poi_sub_type = PoiSubType.find_or_create_by(name: poi_sub_type_name.to_s, poi_type_id: poi_type_id)
    return nil unless poi_sub_type
    poi_data[:poi_sub_type_id] = poi_sub_type.id
  end

  def self.load_poi_chain(poi_data, poi_type_id, row)
    chain_name = PoiLoad.get_xls_column_value(:chain, row)
    chain_identifier = PoiLoad.get_xls_column_value(:chain_identifier, row)
    chain = Chain.find_or_create_by(name: chain_name.to_s, poi_type_id: poi_type_id, identifier: chain_identifier.to_s)
    return nil unless chain
    poi_data[:chain_id] = chain.id
  end

  def self.load_poi_food_type(poi_data, poi_type_id, row)
    food_type_name = PoiLoad.get_xls_column_value(:food_type, row)
    food_type = FoodType.find_or_create_by(name: food_type_name.to_s, poi_type_id: poi_type_id)
    return nil unless food_type
    poi_data[:food_type_id] = food_type.id 
  end

  def self.load_poi_street_type(poi_data, row)
    street_type_name = PoiLoad.get_xls_column_value(:street_type, row)
    street_type = StreetType.find_or_create_by(name: street_type_name.to_s)
    return nil unless street_type
    poi_data[:street_type_id] = street_type.id
  end

  def self.load_poi_country row
    country_name = PoiLoad.get_xls_column_value(:country, row)
    country = Country.find_or_create_by(name: country_name.to_s)
    return nil unless country
    country.id
  end

  def self.load_poi_province(country_id, row)
    province_name = PoiLoad.get_xls_column_value(:province, row)
    province = Province.find_or_create_by(name: province_name.to_s, country_id: country_id)
    return nil unless province
    province.id
  end

  def self.load_poi_department(province_id, row)
    department_name = PoiLoad.get_xls_column_value(:department, row)
    department = Department.find_or_create_by(name: department_name.to_s, province_id: province_id)
    return nil unless department
    department.id
  end

  def self.load_poi_city(poi_data, department_id, row)
    city_name = PoiLoad.get_xls_column_value(:city, row)
    zip = PoiLoad.get_xls_column_value(:zip, row)
    city = City.find_or_create_by(name: city_name.to_s, department_id:  department_id, zip:  zip.to_s)
    return nil unless city
    poi_data[:city_id] = city.id
  end

  def self.load_geometry(poi_data, row)
    poi_data[:latitude] = PoiLoad.get_xls_column_value(:lat, row)
    poi_data[:longitude] = PoiLoad.get_xls_column_value(:lon, row)
  end

  def self.load_poi_name(poi_data, row)
    poi_data[:name] = PoiLoad.get_xls_column_value(:name, row).to_s
  end

  def self.load_poi_street_name(poi_data, row)
    poi_data[:street_name] = PoiLoad.get_xls_column_value(:street_name, row).to_s
  end

  def self.load_poi_house_number(poi_data, row)
    poi_data[:house_number] = PoiLoad.get_xls_column_value(:house_number, row).to_s
  end

  def self.load_poi_identifier(poi_data, row)
    poi_data[:identifier] = formatted_identifier(row)
  end

  def self.formatted_identifier row
    identifier_parts = PoiLoad.get_xls_column_value(:identifier, row).to_s.split("_")
    return nil unless identifier_parts.size == 2
    identifier_parts.last
  end

  def self.load_poi_phone(poi_data, row)
    poi_data[:phone] = PoiLoad.get_xls_column_value(:phone, row).to_s
  end

  def self.load_poi_email(poi_data, row)
    poi_data[:email] = PoiLoad.get_xls_column_value(:email, row).to_s
  end

  def self.load_poi_website(poi_data, row)
    poi_data[:website] = PoiLoad.get_xls_column_value(:website, row).to_s
  end

  def self.load_poi_priority(poi_data, row)
    poi_data[:priority] = PoiLoad.get_xls_column_value(:priority, row).to_i
  end

  def self.load_poi_last_update(poi_data, row)
    date_last_update = PoiLoad.get_xls_column_value(:last_update, row)
    return  nil  unless date_last_update
    poi_data[:last_update] = Date.strptime(date_last_update, '%m/%d/%Y')
 
  end
  
  def self.load_poi_old_identifier(poi_data, row)
    poi_data[:old_identifier] = PoiLoad.get_xls_column_value(:old_identifier, row).to_s
  end
end
