class ProjectType < ApplicationRecord

  include ProjectTypes::Geoserver 
  include ProjectTypes::Indicators 
  include ProjectTypes::Scopes
  include ProjectTypes::Validations

  require 'rgeo/shapefile'
  require 'rgeo/geo_json'
  require 'json'
  require 'fileutils'
  require 'rgeoserver'
  require 'net/http'
  require 'uri'
  require 'csv'

  has_many :project_fields,  dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :dashboards, dependent: :destroy
  has_many :has_project_types, dependent: :destroy
  has_many :users, :through=> :has_project_types
  has_many :project_statuses, dependent: :destroy
  has_many :project_filters
  accepts_nested_attributes_for :project_fields, allow_destroy: true
  accepts_nested_attributes_for :projects, allow_destroy: true

  FILTERS = %w(= < > <= >= != ilike )

  attr_accessor :file, :latitude, :longitude, :address, :department, :province, :country, :data, :type_file

  after_destroy :destroy_view
  before_save :save_shp_file, if: :file_exist? 
  after_create :load_file, if: :file_exist? 
  after_create :new_dashboard
  after_update :load_file, if: :file_exist? 
  after_create :create_project_statuses
  after_create :create_view
  after_update :destroy_view
  after_update :create_view

  #before_create :restart_delayed_job
  #before_destroy :restart_delayed_job

  validates :name,  presence: true
  validates :name, uniqueness: true 
  validate :is_file_type_valid?, if: :file_exist?

  def create_project_statuses
    ProjectStatus.create(name: 'default', color:"#ff00ee", project_type_id: self.id)
  end

  def restart_delayed_job
    system "cd #{Rails.root}; rake jobs:clear; bin/delayed_job restart;"
  end

  def new_dashboard
    Dashboard.create(name: "Dashboard_1", project_type_id: self.id )  
  end

  def self.build_geom(address, department, province, country)

    @street = address
    @city = department  
    @province = province 
    @country = country 
    @address_complete = [[@street], @city, @province, @country].join(', ')
    geocode = Geocoder.coordinates(@address_complete)
    geom = "POINT(#{geocode[1]} #{geocode[0]})" if !geocode.nil?
    geom
  end

  def file_exist?
    if self.file.nil?
      return false
    end
    return true
  end

  def is_file_type_valid?
    self.file.each do |f| @f = f.content_type
    begin
      if @f== "text/csv" ||  @f== "application/x-esri-shape"  || @f == "application/x-esri-crs" || @f=="application/x-dbf" || @f=="text/plain" || @f =="application/vnd.ms-excel" || @f == "application/octet-stream" || @f == "application/geo+json" 
        valid = f.content_type 
      end
    rescue
      valid = false
    end
    self.errors.add(:base, :invalid_type_file) unless valid
    valid
    end
  end

  def self.analysis_type(type, field)
    case type
    when 'sum'
      query = " #{type}(( #{field} )::numeric)"
    when 'count'
      query = " #{type}(( #{field } ))"
    when 'avg'
      query = " #{type}(( #{field} )::numeric)"
    when 'min'
      query = " #{type}(( #{field} )::numeric)"
    when 'max'
      query = " #{type}(( #{field} )::numeric)"
    when 'weighted_average'
      query = "case sum((properties->>'oferta')::numeric) when 0 then 0 else  sum((properties->>'" + field+ "')::numeric * (properties->>'oferta')::numeric) / sum((properties->>'oferta')::numeric) end "
    end
  end

  def load_file
    a = []
    self.file.each do |f|
      case f.content_type
      when 'application/dbf', 'application/octet-stream','application/x-anjuta','application/octet-stream','application/x-dbf','application/x-esri-shape'
        ext = f.original_filename.split('.')
        if ext.last == 'shp'
          a = ProjectType.load_shape(self.id, self.name_layer)
        end
      when 'text/csv', 'text/plain', 'application/vnd.ms-excel'
        a = ProjectType.load_csv(self.id, self.latitude, self.longitude, self.address, self.department, self.province, self.country, self.name_layer, self.type_file)
      when 'application/json'
        load_json()
      when  'application/geo+json'
        load_geojson(self.id, self.name_layer, self.type_geometry)
      end
    end
    a
  end

  def self.read_csv(file)
    @fi = file
    @or = @fi[0].tempfile
    @elements = []
    CSV.foreach(@or, headers: true).with_index do |row, i |
      row.headers.each do |field|
      @elements << field        
    end
    end
    @elements 
  end

  def self.load_csv project_type_id, latitude, longitude, address, department, province, country, name_layer, type_file
    @project_type = JSON.parse(ProjectType.find(project_type_id).directory_name)
    @source_path = @project_type[0]
    @file_name = @project_type[1]
    ct = Apartment::Tenant.current
    items = {}
    fields = []
    CSV.foreach("#{@source_path}/#{@file_name}", headers: true).with_index do |row, i |
      if type_file == 'Children'
        save_rows_project_data_childs row, i , project_type_id 
      else
        if i == 0 
          row.headers.each do |f|
            field = f.parameterize(separator: '_')
            fields << field
            @new_project_field =  ProjectField.where(name: field, key: field, project_type_id: project_type_id, required: false).first_or_create(name: field, key: field, project_type_id: project_type_id, required: false, field_type_id: 1)
          end
        end
        row.to_hash.each_pair do |k,v|

          field_custom = k.parameterize(separator: '_')
          field_type = ProjectField.where(name:field_custom, project_type_id: project_type_id)
          if !field_type.nil?
            if (field_type[0].field_type_id == 7)
              value_parse = JSON.parse(v)
              items.merge!({field_custom.downcase => value_parse}) 
            else
              items.merge!({field_custom.downcase => v}) 
            end
          else
            items.merge!({field_custom.downcase => v}) 
          end
        end
        geom = ''
        if (latitude.present? && longitude.present?)
          lat = items[latitude]
          lng = items[longitude]
          geom = "POINT(#{lng} #{lat})" 
        end
        if(address.present? && province.present? && country.present?)
          address = items[address]
          department = items[department]
          province = items[province]
          country = items[country]
          geom = build_geom(address, department, province, country)
        end
        Project.create(properties: items, project_type_id: project_type_id, the_geom: geom)
      end
    end

  end

  def load_geojson project_type_id, name_layer, type_geometry
    require 'rgeo/geo_json'
    file_name = @directory[1].split('.').first
    items = []
    fields = []
    ct = Apartment::Tenant.current
    items = {}
    st1 = JSON.parse(File.read("#{@directory[0]}/#{file_name}.geojson"))
    data = RGeo::GeoJSON.decode(st1, :json_parser => :json)
    user_id = nil
    data.each do |a|
      properties = a.properties
      properties.each do |idx, value|
        field = value[0].parameterize(separator: '_').downcase
        if idx == 'user_id'
          user_id = value
        else
          field_type = ProjectField.find_or_create_by(key: field, project_type_id: project_type_id)
          fields[idx] = value
        end
        #field_type = ProjectField.find_or_create_by(key: field, project_type_id: project_type_id)
        #fields << field if fields.include?(field)
      end
      the_geom = a.geometry.as_text
      Project.create(properties: properties, project_type_id: project_type_id, the_geom:the_geom, user_id: user_id)
    end
  end

  def validate_options
    if !self.fields.nil?
      self.fields.each do |field|
        if field.cleasing_data?
          new_field = "new_" + field.name
          @new_project_field =  ProjectField.create(name: new_field, field_type: 'text_field', project_type_id: field.product_type_id)
          @new_project_field.save
        end
      end
    end
  end

  def save_shp_file
    @directory = Geoworks::Shp.save(self.file, "shape")
    self.directory_name = @directory.split("/").last
  end

  def self.load_shape project_type_id, name_layer
    project_type = JSON.parse(ProjectType.find(project_type_id).directory_name)
    source_path = project_type[0]
    file_name = project_type[1].split('.').first
    ct = Apartment::Tenant.current
    fields = []
    RGeo::Shapefile::Reader.open("#{source_path}/#{file_name}.shp") do |file|
      file.each do |record|
        record.index
        if record.index == 1
          record.keys.each do |f|
            field = f.parameterize(separator: '_')
            fields << field
            @new_project_field =  ProjectField.where(name: field, key: field, project_type_id: project_type_id, required: false).first_or_create(name: field, key: field, project_type_id: project_type_id, required: false, field_type_id: 1)
          end
        end
      end

      file.rewind
      file.each do |record|
        @prop = {}
        @i = {}
        @geom = ''
        record.attributes.each do |val|
          @val = val[1]
          @i["#{val[0]}"] = val[1].to_s.force_encoding(Encoding::UTF_8)
        end

        @rec = record
        @geom = record.geometry.as_text if !record.geometry.nil?
        @projects = Project.create( properties: @i.to_h, project_type_id: project_type_id, the_geom: @geom )
      end
    end
  end

  def self.counters(id)
    count = Project.where(project_type_id: id).count
  end

  def create_view

    fields = self.project_fields
    current_tenant = Apartment::Tenant.current 
    project_type_id = self.id
    name_layer = self.name_layer
    type_geometry = self.type_geometry

    vv = "CREATE OR REPLACE VIEW #{current_tenant}.#{name_layer} AS "
    vv += " select "
    fields.each do |field|
      if field.key != ''
        if field.key != 'app_estado' && field.key != 'app_usuario'
          if field.popup == true || field.filter_field == true || field.heatmap_field == true || field.colored_points_field == true
            vv += " properties->>'#{field.key}' as #{field.key}, "
          end
        end
      end
    end
    vv += " users.name as app_usuario, "
    vv += " project_statuses.name as app_estado, "
    vv += " projects.project_type_id, "
    vv += " st_y(the_geom),  " if type_geometry != 'Polygon'
    vv += " st_x(the_geom), "if type_geometry != 'Polygon'
    vv += " project_statuses.color, "
    vv += " the_geom "
    vv += " FROM #{current_tenant}.projects "
    vv += " LEFT OUTER JOIN #{current_tenant}.project_statuses ON projects.project_status_id = project_statuses.id "
    vv += " JOIN public.users ON users.id = projects.user_id "
    vv += " where projects.project_type_id =#{project_type_id} ; "
    view = ActiveRecord::Base.connection.execute(vv)
    return
  end

  def destroy_view
    query = "DROP VIEW IF EXISTS #{self.name_layer}"
    ActiveRecord::Base.connection.execute(query)
  end



  def self.save_rows_project_data_childs row, i, project_type_id 
    result_hash = {}

    if !row.nil?
      child_data = ProjectDataChild.new()
      project_field_id = 661
      project = Project.where("properties->>'numero_trampa' = '#{row['trampa']}' and project_type_id = #{project_type_id}").select(:id).first
      if !project.nil?
      child_data[:project_id] = project.id
      value_name = {}
      row.each do |data |
        field = ProjectSubfield.where(key: data[0], project_field_id: project_field_id).first
        if !field.nil?
          value_name.merge!("#{field.id}": data[1] ) 
        end
      end

      child_data[:properties] = [value_name]
      child_data[:project_field_id] = project_field_id
      child_data.save
    end
    end
  end
end
