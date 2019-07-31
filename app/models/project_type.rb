class ProjectType < ApplicationRecord

  require 'rgeo/shapefile'
  require 'rgeo/geo_json'
  require 'json'
  require 'fileutils'
  require 'rgeoserver'
  require 'net/http'
  require 'uri'
  require 'csv'

  #belongs_to :user
  has_many :fields, class_name: "ProjectField", dependent: :destroy
  has_many :projects, dependent: :destroy
  has_many :dashboards, dependent: :destroy
  has_many :has_project_types, dependent: :destroy
  has_many :users, :through=> :has_project_types

  accepts_nested_attributes_for :fields, allow_destroy: true

  FILTERS = %w(= < > <= >= != ilike )

  attr_accessor :file, :latitude, :longitude, :address, :department, :province, :country, :data

  validates :name,  presence: true
  validates :name, uniqueness: true 
  validates :file, presence: true, on: :create

  # validates :q, presence: true 
  #validate :file_exist?
  validate :is_file_type_valid?, if: :file_exist?

  #before_create :restart_delayed_job
  #before_destroy :restart_delayed_job
  before_save :save_shp_file, if: :file_exist? 
  after_create :load_file, if: :file_exist? 
  after_create :new_dashboard
  after_update :load_file, if: :file_exist? 

  #before_save :load_rgeoserver
  #after_save :load_shape,  if: :file_exist?
  #validate :validate_options

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
    return geom
  end

  def file_exist?

    @a = self.file
    if self.file.nil?
      return false
    end
    return true
  end

  def is_file_type_valid?
    @fi = self.file
    self.file.each do |f| @f = f.content_type
    begin
      if @f== "text/csv" ||  @f== "application/x-esri-shape"  || @f == "application/x-esri-crs" || @f=="application/x-dbf" || @f=="text/plain" || @f =="application/vnd.ms-excel" || @f == "application/octet-stream" 
        valid = f.content_type 
      end
    rescue
      valid = false
    end
    self.errors.add(:base, :invalid_type_file) unless valid
    valid
    end
  end

  def self.kpi_without_graph(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions)

    @ct = Apartment::Tenant.current
    #@filter_condition = filter_condition
    @type_box = type_box
    @arr1 = []

    @size = size_box

    @size = size_box
    if type_box == 'polygon'
      @size.each do |a,x|
        z = []
        @a = a
        @x = x
        x.each do |b,y|
          @b = b
          @y = y
          z.push(y)
        end
        @arr1.push([z])
      end
    else
      minx = size_box[0].to_f if !size_box.nil?
      miny = size_box[1].to_f if !size_box.nil?
      maxx = size_box[2].to_f if !size_box.nil?
      maxy = size_box[3].to_f if !size_box.nil?
    end
    querys=[]
    @data_fixed = ''
    @op = option_graph

    if type_box == 'extent'
      data = Project.where(project_type_id: project_type_id).where("#{@ct}.st_contains(#{@ct}.st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})")
      @data_fixed = data
    end

    if type_box == 'polygon'
      data = Project.where(project_type_id: project_type_id).where("st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{@arr1}}'),4326), #{:the_geom})")
      @data_fixed = data
    end
      if !data_conditions.blank?
        data_conditions.each do |key| 
          @s = key.split('|')
          @field = @s[0]
          @filter = @s[1]
          @value = @s[2]
          if (@filter == '<' || @filter == '>' || @filter == '>=' || @filter == '<=' )
            data =  data.where(" (properties->>'" + @field +"')::numeric" +  @filter +"#{@value}")
          else
            data =  data.where(" properties->>'" + @field +"'" +  @filter +"#{@value}")
          end 
        end
      @data_fixed = data
      end
    #  if type_box == 'filter'
    #        data = Project.where(project_type_id: chart.project_type_id).where("properties->>'" + @filter_condition[0] +  "' " + @filter_condition[1]  + " ?", @filter_condition[2])
    #      end


    @total_row = Project.where(project_type_id: project_type_id).count
    @row_selected = @data_fixed.count 
    @avg_selected = [{ "count": ((@row_selected.to_f / @total_row.to_f) * 100).round(2)} ]
    querys << { "title":"Total", "description":"Total", "data":[{"count":@total_row}], "id": 1000}
    querys << { "title":"Selecionado", "description":"select", "data":[{"count":@row_selected}], "id": 1001}
    querys << { "title":"% del Total", "description":"AVG", "data":@avg_selected, "id": 1002}
    
    @analytics_charts = AnalyticsDashboard.where(project_type_id: project_type_id, graph: false)
    @analytics_charts.each do |chart|

          if !chart.sql_sentence.blank?

             field_select = chart.sql_sentence
          else
            field_select = analysis_type(chart.analysis_type.name, chart.project_field.key)
            conditions_field = chart.condition_field
          end
      if !data_conditions.blank?
        data_conditions.each do |key| 
          @s = key.split('|')
          @field = @s[0]
          @filter = @s[1]
          @value = @s[2]
          if (@filter == '<' || @filter == '>' || @filter == '>=' || @filter == '<=' )
            data =  data.where(" (properties->>'" + @field +"')::numeric" +  @filter +"#{@value}")
          else
            data =  data.where(" properties->>'" + @field +"'" +  @filter +"#{@value}")
          end 
        end
      end
      if !conditions_field.blank?
        data =  data.where(" properties->>'" + conditions_field.name + "' " + chart.filter_input + "'#{chart.input_value}'")
      end
      data=   data.select(field_select)
      querys << { "title":"#{chart.title}", "description":"kpi_sin grafico", "data":data, "id": chart.id}
    end


    querys
  end

  def self.kpi_new(project_type_id, option_graph, size_box, type_box, dashboard_id, data_conditions)

    @arr1 = []
    @size = size_box
    if type_box == 'polygon'
      @size.each do |a,x|
        z = []
        @a = a
        @x = x
        x.each do |b,y|
          @b = b
          @y = y
          z.push(y)
        end
        @arr1.push([z])
      end
    else
      minx = size_box[0].to_f if !size_box.nil?
      miny = size_box[1].to_f if !size_box.nil?
      maxx = size_box[2].to_f if !size_box.nil?
      maxy = size_box[3].to_f if !size_box.nil?
    end
    querys=[]
    @op = option_graph
    @dashboard_id = dashboard_id

    @ct = Apartment::Tenant.current
    @graph = Graphic.where(dashboard_id: @dashboard_id)
    @graph.each do |g|
      @gr = GraphicsProperty.where(graphic_id: g)
      ch = {}
      @gr.each_with_index do |graph, i|

        @analytics_charts = AnalyticsDashboard.where(id: graph.analytics_dashboard_id)

        @analytics_charts.each do |chart|

          @items = {}
          if type_box == 'extent'
            data = Project.joins("left outer join project_data_children on projects.id = project_data_children.project_id").where(project_type_id: project_type_id).where("#{@ct}.st_contains(#{@ct}.st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326), #{:the_geom})")
          else
            data = Project.joins("left outer join project_data_children on projects.id = project_data_children.project_id").where(project_type_id: project_type_id).where("st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{@arr1}}'),4326), #{:the_geom})")
          end
          data.joins(:project_data_child)

          if !chart.sql_sentence.blank?
            if chart.group_sql.blank?
              @field_group = "projects.properties->>'"+ chart.group_field.key + "'"
            else
              @field_group = chart.group_sql
            end
            if chart.order_sql.blank?
             data = data.select(chart.sql_sentence).group(@field_group).order(@field_group)
            else
              @order_sql = chart.order_sql
             data = data.select(chart.sql_sentence).group(@field_group).order(@order_sql)
            end
          else

            @field_select = analysis_type(chart.analysis_type.name, chart.project_field.key) + ' as count'
            @field_select += ", projects.properties->>'" + chart.group_field.key + "' as name "
            @field_group = "projects.properties->>'"+ chart.group_field.key + "'"

            data =  data.select(@field_select).group(@field_group).order(@field_group)
          end

          if !data_conditions.blank?
            data_conditions.each do |key| 
              @s = key.split('|')
              @field = @s[0]
              @filter = @s[1]
              @value = @s[2]
              data =  data.where(" projects.properties->>'" + @field +"'" +  @filter +"#{@value}")
            end
          end
            conditions_field = chart.condition_field
            @ch = chart
            @cf = conditions_field
          if !conditions_field.blank?
            data =  data.where("projets.properties->>'" + conditions_field.name + "' " + chart.filter_input + "'#{chart.input_value}'")
          end
          @items["serie#{i}"] = data
          @option_graph = graph
          chart_type = graph.chart.name
          ch["it#{i}"] = { "description":data.to_sql, "chart_type":chart_type, "group_field":@field_group,"chart_properties": @option_graph, "data":@items, "graphics_options": g}
        end
        ch
      end
      querys << ch
      @qu =querys
    end
    querys
  end

  def self.analysis_type(type, field)
    case type
    when 'sum'
      query = " #{type}((projects.properties->>'" + field+ "')::numeric)"
    when 'count'
      query = " #{type}((projects.properties->>'" + field + "'))"
    when 'avg'
      query = " #{type}((projects.properties->>'" + field+ "')::numeric)"
    when 'min'
      query = " #{type}((projects.properties->>'" + field+ "')::numeric)"
    when 'max'
      query = " #{type}((projects.properties->>'" + field+ "')::numeric)"
    when 'weighted_average'
      query = "case  sum((properties->>'oferta')::numeric) when 0 then 0 else  sum((properties->>'" + field+ "')::numeric * (properties->>'oferta')::numeric) / sum((properties->>'oferta')::numeric) end "
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
        a = ProjectType.load_csv(self.id, self.latitude, self.longitude, self.address, self.department, self.province, self.country, self.name_layer)
        #when 'application/xls', 'application/vnd.ms-excel'
        #  'xls'
      when 'application/json'
        load_json()
      when  'application/geo+json'
        load_geojson()
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

  def self.load_csv project_type_id, latitude, longitude, address, department, province, country, name_layer
    @project_type = JSON.parse(ProjectType.find(project_type_id).directory_name)
    @source_path = @project_type[0]
    @file_name = @project_type[1]
    ct = Apartment::Tenant.current
    items = {}
    fields = []
    CSV.foreach("#{@source_path}/#{@file_name}", headers: true).with_index do |row, i |
      if i == 0 

        row.headers.each do |f|
          field = f.parameterize(separator: '_')
          fields << field
          @new_project_field =  ProjectField.where(name: field, key: field, project_type_id: project_type_id, required: false).first_or_create(name: field, key: field, project_type_id: project_type_id, required: false, field_type_id: 1)
        end
        create_view(fields, ct, project_type_id, name_layer)

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
      #items = row.to_h
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
                  #     else
                  #     i["#{item[0]}"] = item[1]
                end
              else

                if properties[0][:field_type] == 'ChoiceField' 

                  if !item[1]['other_values'].empty?
                    i["#{item[0]}"] = item[1]['other_values'][0]
                  else
                    i["#{item[0]}"] = item[1]['choice_values'][0]
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
    @records = client.records.all(form_id: id, per_page: 100000)
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

  def self.load_shape project_type_id, name_layer
    project_type = JSON.parse(ProjectType.find(project_type_id).directory_name)
    source_path = project_type[0]
    file_name = project_type[1].split('.').first
    #    file_name = @directory[1].split('.').first

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

      create_view(fields, ct, project_type_id, name_layer)
     
      file.rewind
      file.each do |record|
        @prop = {}
        @i = {}
        @geom = ''
        record.attributes.each do |val|
          @val = val[1]

          @i["#{val[0]}"] = val[1].to_s.force_encoding(Encoding::UTF_8)
          #  @i["#{val[0]}"] = val[1]
        end

        @rec = record
        @geom = record.geometry.as_text if !record.geometry.nil?
        @projects = Project.create( properties: @i.to_h, project_type_id: project_type_id, the_geom: @geom )
        #record = file.next
      end
    end
  end

  def self.load_rgeoserver
    #   curl -u admin:geoserver -XGET http://localhost:8080/geoserver/rest/layers.json
    require 'net/http'
    require 'uri'

    uri = URI.parse("http://localhost:8080/geoserver/rest/workspaces")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth("admin", "geoserver")
    request.content_type = "text/xml"
    request.body = "<workspace><name>earthws</name></workspace>"

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    # response.code
    # # response.body

  end

  def self.ds_rgeoserver
    require 'net/http'
    require 'uri'

    uri = URI.parse("http://localhost:8080/geoserver/rest/workspaces/earthws/datastores")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth("admin", "geoserver")
    request.content_type = "text/xml"
    request.body = "
<dataStore>
<name>earthds</name>
<connectionParameters>
     <host>localhost</host>
          <port>5432</port>
               <database>earth</database>
                    <schema>public</schema>
                         <user>postgres</user>
                              <passwd>postgres</passwd>
                                   <dbtype>postgis</dbtype>
                                   </connectionParameters>
                                   </dataStore>"

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
  end

  def self.get_layer_rgeoserver

    require 'net/http'
    require 'uri'

    uri = URI.parse("http://localhost:8080/geoserver/rest/layers.json")
    request = Net::HTTP::Get.new(uri)
    request.basic_auth("admin", "geoserver")

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end

    # response.code
    response.body
  end

  def self.add_layer_geoserver(name_layer)
    require 'net/http'
    require 'uri'

    ct = Apartment::Tenant.current
    uri = URI.parse("http://localhost:8080/geoserver/rest/workspaces/geoworks/datastores/#{ct}/featuretypes")

    request = Net::HTTP::Post.new(uri)
    request.basic_auth("admin", "geoserver")
    request.content_type = "text/xml"
    request.body = "<featureType><name>#{name_layer}</name></featureType>"

    req_options = {
      use_ssl: uri.scheme == "https",
    }

    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    response.body
    return
  end

  def self.counters(id)
    count = Project.where(project_type_id: id).count
  end

  def  kpi

  end

  def self.create_view(fields, current_tenant, project_type_id, name_layer)

    vv = "CREATE OR REPLACE VIEW #{current_tenant}.#{name_layer} AS "
    vv += " select "
    fields.each do |field|

      vv += " properties->>'#{field}' as #{field}, "
    end
    vv += " project_type_id, "
    vv += " st_y(the_geom),  "
    vv += " st_x(the_geom), "
    vv += " the_geom "
    vv += "FROM #{current_tenant}.projects where project_type_id =#{project_type_id} ; "
    view = ActiveRecord::Base.connection.execute(vv)
    return
  end
end
