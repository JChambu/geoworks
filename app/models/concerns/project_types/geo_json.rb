module ProjectTypes::GeoJson
  extend ActiveSupport::Concern

  included do
    #valida geometrías, tipo de archivo y si el archivo existe
    validate :is_file_type_valid?, if: :file_exist?
    validate :is_geom_valid?, if: :is_file_type_valid?
  end

  def save_file
    @directory = Geoworks::Shp.save(self.file, "shape")
    self.directory_name = @directory.split("/").last
  end

  def self.build_geom(address, department, province, country)
    #Revisión de código necesario. Chequear si esta función se está utilizando
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
    #Verifica si exite el archivo
    if self.kind_file == 'true'
      if self.file.nil?
        self.errors.add(:file, "no puede ser vacío")
        return false
      end
    end
  return true
  end

  def is_file_type_valid?
    #Verifica si es un archivo válido
    if self.kind_file == 'true' && file_exist?
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

  def is_geom_valid?
    #Verifica si contiene geometrías válidas y el geojson está bien armado
    if self.kind_file == 'true'
      count_verify = 0
      self.file.each do |f|
          if @f == "application/geo+json" || @f =="application/octet-stream"
            verify_geojson_result = verify_geojson(self.type_geometry)
            count_verify += verify_geojson_result
          end
      end
      if count_verify == 0 
        return true
      else
        return false
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

    file_name = @directory[1].split('.').first
    items = []
    fields = {}
    count_insert = 0
    count_errors = 0
    ct = Apartment::Tenant.current
    items = {}
    file_uploaded = File.open ("#{@directory[0]}/#{file_name}.geojson")
    #coloca el puntero del archivo en la primera posición
    file_uploaded.seek(0)
    st1 = JSON.parse(file_uploaded.read)
    data = RGeo::GeoJSON.decode(st1, :json_parser => :json)
    project_status = ProjectStatus.where(project_type_id: self.id, name: 'Default').first
    data.each do |a|
      if a.geometry.geometry_type.to_s.downcase == self.type_geometry.downcase
        properties = a.properties
        properties.each do |idx, value|
          field_type = ProjectField.where(name: idx, project_type_id: project_type_id, field_type_id: (FieldType.where(name: 'Texto').pluck(:id)), roles_edit: '[""]', roles_read: '[""]').first_or_create!
          fields[field_type.key] = value
        end
        ProjectField.where(name: 'app_usuario', project_type_id: project_type_id, hidden: true, read_only: true, field_type_id: (FieldType.where(name: 'Numerico').pluck(:id)),roles_edit: '[""]', roles_read: '[""]').first_or_create!
        ProjectField.where(name: 'app_estado', project_type_id: project_type_id, hidden: true, read_only: true, field_type_id: (FieldType.where(name: 'Numerico').pluck(:id)), roles_edit: '[""]', roles_read: '[""]').first_or_create!
        ProjectField.where(name: 'app_id', project_type_id: project_type_id, hidden: true, read_only: true, field_type_id: (FieldType.where(name: 'Numerico').pluck(:id)), roles_edit: '[""]', roles_read: '[""]').first_or_create!
        fields['app_usuario'] = user_id
        fields['app_estado'] = project_status.id

        the_geom = a.geometry.as_text
        row = Project.create(
          properties: fields,
          project_type_id: project_type_id,
          the_geom:the_geom,
          user_id: user_id,
          project_status_id: project_status.id,
          gwm_created_at: Time.zone.now,
          gwm_updated_at: Time.zone.now
        )
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
    return
  end

  def verify_geojson type_geometry
    require 'rgeo/geo_json'

    @directory = save_file 
    Rails.logger.debug "Debugg directorio "+@directory.to_s
    file_name = @directory[1].split('.').first
    count_errors_geom_type = 0
    total_errors = 0
    begin
      file_uploaded = File.open ("#{@directory[0]}/#{file_name}.geojson")
      file_uploaded.seek(0)
      st1 = JSON.parse(file_uploaded.read)

      begin
        data = RGeo::GeoJSON.decode(st1, :json_parser => :json)
        data.each do |a|
          if a.geometry.geometry_type.to_s.downcase == self.type_geometry.downcase     
          else
            count_errors_geom_type += 1
          end
        end

        if count_errors_geom_type > 0 
          total_errors +=count_errors_geom_type
          self.errors.add(:base, "Hay "+count_errors_geom_type.to_s+ " geometrías que no son tipo "+self.type_geometry.to_s)
        end
      rescue
        total_errors += 1
        self.errors.add(:base, "El archivo no contiene Geometrías Válidas")
      end
    rescue JSON::ParserError
      total_errors += 1
      self.errors.add(:base, "El archivo no contiene un Json Válido")
    end

    total_errors
  end


end
