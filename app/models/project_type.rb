class ProjectType < ApplicationRecord

  require 'rgeo/shapefile'
  require 'rgeo/geo_json'
  require 'json'
  require 'fileutils'
  require 'rgeoserver'
  require 'net/http'
  require 'uri'
  require 'csv'

  belongs_to :user
  has_many :fields, class_name: "ProjectField"
  has_many :analytics_dashboards
  has_many :projects
  accepts_nested_attributes_for :fields, allow_destroy: true

  attr_accessor :file

  before_save :save_shp_file, if: :file_exist? 
  after_create :load_file, if: :file_exist? 
  #before_save :load_rgeoserver

  #after_save :load_shape,  if: :file_exist?

  #validate :validate_options

  def file_exist?
    if !self.file.nil?
      return true
    end
  end

  def load_file 
    self.file.each do |f|
      p f.content_type

      case f.content_type
        #when 'application/dbf', 'application/octet-stream','application/x-anjuta','application/octet-stream','application/x-dbf','application/x-esri-shape'
      when 'application/x-esri-shape'
        load_shape()
      when 'text/csv'
        load_csv()
      when 'application/xls', 'application/vnd.ms-excel'
        p 'xls'
      when 'application/json'
        load_json()
      when  'application/geo+json'
        load_geojson()
      end
    end

  end

  def load_csv 
    file_name = @directory[1].split('.').first
    items = []
    CSV.foreach("#{@directory[0]}/#{file_name}.csv", headers: true).with_index do |row, i |

      if i == 0 
        row.headers.each do |field|
          @new_project_field =  ProjectField.create(name: field, field_type: 'text_field', project_type_id: self.id)
        end
      end
      items = row.to_h
      Project.create(properties: items, project_type_id: self.id)
    end
  end

  def load_json
    file_name = @directory[1].split('.').first
    items = []
    data = Rgeo::GeoJSON.decode("#{@directory[0]}/#{file_name}.json", json_parser: :json )

    @d = data
    @d.each do |item|
      p item
      @it = item
      #     items =  item

      #    Project.create(properties: items, project_type_id: self.id)
    end
  end

  def load_geojson
    file_name = @directory[1].split('.').first
    items = []
    data = JSON.parse(File.read("#{@directory[0]}/#{file_name}.geojson"))
    @d = data
    data.each do |item|

      @item = item 

      # Project.create(properties: items, project_type_id: self.id)
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


  def self.migration


    @choice_lists = fulcrum_choice_lists    

    @choice_lists.objects.each do |list|

      list['choices'].each do |choice|


        choise_list = ChoiceList.where(name: list['name'], key: list['id'], value: choice['value'], label: choice['label']).first_or_create(name: list['name'], key: list['id'], value: choice['value'], label: choice['label']).update_attributes!(name: list['name'], key: list['id'], value: choice['value'], label: choice['label'])
      end
    end

    @forms = query_fulcrum

    @forms.objects.each do |form|
      if form['name'] == 'Nextel'

        @form = form

        @project_type = ProjectType.where(name: form['name'], user_id: 1).first_or_create
        item_statics = ["latitude", "longitude","status"]

        item_statics.each do |is|
          @new_project_field =  ProjectField.where(key: is, project_type_id: @project_type.id).first_or_create(name: is, field_type: 'text_field', project_type_id: @project_type.id, key: is).update_attributes!(name: is, field_type: 'text_field', project_type_id: @project_type.id, key: is)
        end 

        form['elements'].each do |e|

          @new_project_field =  ProjectField.where(key:e['key']).first_or_create(name: e['label'], field_type: e['type'], project_type_id: @project_type.id, key: e['key'], choice_list_id: e['choice_list_id']).update_attributes!(name: e['label'], field_type: e['type'], project_type_id: @project_type.id, key: e['key'], choice_list_id: e['choice_list_id'])

          if !e['elements'].nil?
            e['elements'].each do |element|
              @new_project_field =  ProjectField.where(key:element['key']).first_or_create(name: element['label'], field_type: 'text_field', project_type_id: @project_type.id, key: element['key'], choice_list_id: element['choice_list_id']).update_attributes!(name: element['label'], field_type: element['type'], project_type_id: @project_type.id, key: element['key'],choice_list_id: element['choice_list_id'] )
            end
          end
        end

        @record = records_fulcrum(form['id'] )
        @record.objects.each do |val|

          @geom = "POINT(#{val['longitude']} #{val['latitude']})" 
          @val = val['form_values']
          items = {
            "longitude"=> val['longitude'],
            "latitude" => val['latitude'],
            "status"=>    val['status'],
            "created_at"=>  val['created_at']
          }
          if  val['form_values'] 
            i = {}  
            val['form_values'].each do |item|

              properties = ProjectField.where(key: item[0])

              if properties[0][:field_type] == 'ChoiceField' and !properties[0][:choice_list_id].nil?
                ch_list = ChoiceList.where(key:properties[0][:choice_list_id], value: item[1]["choice_values"] )  
                @ch_l = ch_list
                if !ch_list[0].nil?
                i["#{item[0]}"] = ch_list[0].id
                else
                i["#{item[0]}"] = item[1]
                end
              else
                if properties[0][:field_type] == 'ChoiceField' 
    
                  if !item[1]['other_values'].nil?
                    i["#{item[0]}"] = item[1]['other_values']
                  else
                    i["#{item[0]}"] = item[1]['choice_values']
                  end
                else
                i["#{item[0]}"] = item[1]
              end
            end
            end
          @it = items.merge(i)
          @projects = Project.where("properties_original->>'id' ='#{val['id']}'").first_or_create( properties: @it,  properties_original: val, project_type_id: @project_type.id, the_geom: @geom).update_attributes( properties: @it,  properties_original: val, project_type_id: @project_type.id, the_geom: @geom)
        end
      end
    end
  end
  end



  def self.conect_fulcrum
    client = Fulcrum::Client.new('c6abd6bd9e786cecd7a105395126352bde51d99e054c44256f1652ae0a4fbe4ef4bbf4f2022d84af')
  end

  def self.fulcrum_choice_lists
    client = conect_fulcrum
    choice_lists = client.choice_lists.all()
  end

  def self.query_fulcrum
    client = conect_fulcrum
    #      forms = client.forms.find('10e64be4-f9c5-4f32-8505-523628c52d46')
    forms = client.forms.all()

  end


  def self.records_fulcrum(id)
    client = conect_fulcrum
    @records = client.records.all(form_id: id, per_page: 100000z)
  end


  def self.records_maps(id)
    client = Fulcrum::Client.new('c6abd6bd9e786cecd7a105395126352bde51d99e054c44256f1652ae0a4fbe4ef4bbf4f2022d84af')
    @records = client.records.all(form_id: id )
  end

  def self.graph2(id)

    client = Fulcrum::Client.new('c6abd6bd9e786cecd7a105395126352bde51d99e054c44256f1652ae0a4fbe4ef4bbf4f2022d84af')
    @records = client.records.all(form_id: id )
  end

  def save_shp_file
    @directory = Geoworks::Shp.save(self.file, "shape")
    self.directory_name = @directory.split("/").last
  end

  def load_shape
    file_name = @directory[1].split('.').first
    RGeo::Shapefile::Reader.open("#{@directory[0]}/#{file_name}.shp") do |file|
      file.each do |record|
        p record.index
        if record.index == 0
          record.keys.each do |field|
            @new_project_field =  ProjectField.create(name: field, field_type: 'text_field', project_type_id: self.id)
            @new_project_field.save
          end
        end
      end
      file.rewind
      file.each do |record|
        @attribu = record.attributes
        @data = @attribu
        @geom = record.geometry.as_text
        @projects = Project.create( properties: @data, project_type_id: self.id, the_geom: @geom )
        record = file.next
      end
    end
  end

  def self.load_rgeoserver
    uri = URI.parse("http://localhost:8080/geoserver/rest/workspaces")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth("admin", "geoserver")
    request.content_type = "text/xml"
    request.body = "<workspace><name>acme_ruby_23</name></workspace>"

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    # response.code
    # # response.body
  end

  def self.counters(id)
    count = Project.where(project_type_id: id).count
  end

end
