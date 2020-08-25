module ProjectTypes::GeoJson
  extend ActiveSupport::Concern

  included do
    validate :is_file_type_valid?, if: :file_exist?

  end
  def save_file
    @directory = Geoworks::Shp.save(self.file, "shape")
    self.directory_name = @directory.split("/").last
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

    if self.kind_file == 'true'
      if self.file.nil?
        self.errors.add(:file, "no puede ser vacío") 
        return false
      end
    end
  return true
  end

  def is_file_type_valid?

    if self.kind_file == 'true'
        self.file.each do |f| @f = f.content_type
        begin
          if @f == "application/geo+json" || @f =="application/octet-stream" 
            valid = f.content_type 
          end
        rescue
          valid = false
        end
        self.errors.add(:base, "Tipo de Archivo invalido - #{f.content_type}") unless valid
        valid
        end
      end
  end


    def load_file
      a = []
      self.file.each do |f|
          if @f == "application/geo+json" || @f =="application/octet-stream" 
            load_geojson(self.id, self.name_layer, self.type_geometry, self.user_id)
          end
      end
      a
    end

    def load_geojson project_type_id, name_layer, type_geometry, user_id
      
      require 'rgeo/geo_json'

      @directory = save_file
      file_name = @directory[1].split('.').first
      items = []
      fields = {}
      count_insert = 0
      count_errors = 0
      ct = Apartment::Tenant.current
      items = {}
      st1 = JSON.parse(File.read("#{@directory[0]}/#{file_name}.geojson"))
      data = RGeo::GeoJSON.decode(st1, :json_parser => :json)
      project_status = ProjectStatus.where(project_type_id: self.id, name: 'Default').first
      data.each do |a|
        if a.geometry.geometry_type.to_s.downcase == self.type_geometry.downcase
          properties = a.properties
          properties.each do |idx, value|
            field_type = ProjectField.where(name: idx, project_type_id: project_type_id, field_type_id: (FieldType.where(name: 'Texto').pluck(:id))).first_or_create!
            fields[field_type.key] = value
          end
          ProjectField.where(name: 'app_usuario', project_type_id: project_type_id, field_type_id: (FieldType.where(name: 'Texto').pluck(:id))).first_or_create!
          ProjectField.where(name: 'app_estado', project_type_id: project_type_id, field_type_id: (FieldType.where(name: 'Texto').pluck(:id))).first_or_create!
          ProjectField.where(name: 'app_id', project_type_id: project_type_id, field_type_id: (FieldType.where(name: 'Texto').pluck(:id))).first_or_create!
          ProjectField.where(name: 'gwm_created_at', project_type_id: project_type_id, hidden: true, read_only: true, field_type_id: (FieldType.where(name: 'Fecha').pluck(:id))).first_or_create!
          ProjectField.where(name: 'gwm_updated_at', project_type_id: project_type_id, hidden: true, read_only: true, field_type_id: (FieldType.where(name: 'Fecha').pluck(:id))).first_or_create!
          fields['app_usuario'] = user_id
          fields['app_estado'] = project_status.id

          the_geom = a.geometry.as_text
          row = Project.create(properties: fields, project_type_id: project_type_id, the_geom:the_geom, user_id: user_id, project_status_id: project_status.id )
          if row.valid?
            row.properties.merge!('app_id': row.id)
            row.save
            count_insert += count_insert
          else
            count_errors += count_errors
          end
        else
          count_errors += count_errors
        end
      end
      return count_errors, count_insert 
    end
  end
