class LoadLocation < ActiveRecord::Base
require 'fileutils'

  validate :file_exist?
  validate :is_file_type_valid?
  before_save :save_xls_file
  after_save :delay_load_location
  
  attr_accessor :file


  XLS_COLUMNS=[
    :country,
    :province,
    :department,
    :city,
    :zip
  ]
  
  
  
  def save_xls_file
    directory = Geoworks::Xls.save(self.file, "location/loaded_xls", "location.xls")
    self.directory_name = directory.split("/").last
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

  def delay_load_location
    LoadLocation.load_location_xls(self.id)
  end

def self.load_location_xls load_id


    location_load = LoadLocation.find(load_id)
@ll = location_load
    #begin      
      Geoworks::Xls.read(location_load.source_path) do |sheet, row|

        @r = row
        @s = sheet
        next if row.idx == 0 #The first row match with the column names
        if LoadLocation.empty_row? row
          #poi_load.update_column(:status, :complete)      
          return
        end
      
        location = LoadLocation.build_location(row)
    end
end

  def self.empty_row? row
    identif = LoadLocation.get_xls_column_value(:country, row)
    (identif.nil? or identif.empty?)
  end
def self.build_location row

    country_id = load_poi_country(row)
    province_id = load_poi_province(country_id, row)
    department_id = load_poi_department(province_id, row)
    load_poi_city(department_id, row)

end  
  
  def source_path
    return nil unless self.directory_name
    "#{self.source_dir}location.xls"
  end
 

  def source_dir
    "#{Rails.public_path.to_s}/location/loaded_xls/#{self.directory_name}/"
  end


  def self.load_poi_country row
    country_name = LoadLocation.get_xls_column_value(:country, row)
    country = Country.find_or_create_by(name: country_name.to_s)
    return nil unless country
    country.id
  end

  def self.load_poi_province(country_id, row)
    province_name = LoadLocation.get_xls_column_value(:province, row)
    province = Province.find_or_create_by(name: province_name.to_s, country_id: country_id)
    return nil unless province
    province.id
  end

  def self.load_poi_department(province_id, row)
    department_name = LoadLocation.get_xls_column_value(:department, row)
    department = Department.find_or_create_by(name: department_name.to_s, province_id: province_id)
    return nil unless department
    department.id
  end

  def self.load_poi_city( department_id, row)
    city_name = LoadLocation.get_xls_column_value(:city, row)
    zip = LoadLocation.get_xls_column_value(:zip, row)
    city = City.find_or_create_by(name: city_name.to_s, department_id: department_id, :zip => zip.to_s)
    return nil unless city
   # poi_data[:city_id] = city.id
  end


  def self.get_xls_column_value column, xls_row
    index = XLS_COLUMNS.find_index column
    return nil unless index
    xls_row[index]
  end

end
