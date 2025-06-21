module ProjectTypes::Geoserver
  extend ActiveSupport::Concern

  module ClassMethods
    def reload_rgeoserver

      puts ''
      puts ' ********* reload_rgeoserver ********* '
      p "ENTRA A Reload geoserver"
      puts ' ********* ' 
      puts ''

      require 'net/http'
      require 'uri'

      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:8080/geoserver/rest/reload")
      request = Net::HTTP::Post.new(uri)
      request.basic_auth(ENV['GEOSERVER_USER'], ENV['GEOSERVER_PASSWORD'])
      request.content_type = "text/xml"
      req_options = {
        use_ssl: uri.scheme == "https",
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end

      puts ''
      puts ' ********* reload_rgeoserver ********* '
      p "Reload geoserver response"
      p response.body
      puts ' ********* ' 
      puts ''

      [response.body, response.code]
    end

    def exist_layer_rgeoserver( name, current_tenant = Apartment::Tenant.current  )
      
      puts ''
      puts ' ********* exist_layer_rgeoserver ********* '
      p "Entra acá PRIMERO"
      puts ' ********* ' 
      puts ''

      return false if name.nil?
      layer = ProjectType.get_layer_rgeoserver( name, current_tenant )

      puts ''
      puts ' ********* exist_layer_rgeoserver SEXTO********* '
      p "layer"
      p layer
      puts ' ********* ' 
      puts ''

      request = [false, "400"]
      if layer[0]
        puts ''
        puts ' ********* exist_layer_rgeoserver SEPTIMO ********* '
        p "Aca en if layer[0]"
        puts ' ********* ' 
        puts ''
        request = ProjectType.reload_rgeoserver

        puts ''
        puts ' ********* exist_layer_rgeoserver SEPTIMO ********* '
        p "Aca en if layer[0]"
        p request
        puts ' ********* ' 
        puts ''
      else
        name_layer = ProjectType.where(name_layer: name)

        puts ''
        puts ' ********* exist_layer_rgeoserver ELSE SEPTIMO********* '
        p "Aca en name_layer = Project..... name_layer"
        p name_layer
        puts ' ********* ' 
        puts ''

        if name_layer
          request = ProjectType.add_layer_geoserver(name, current_tenant)
        end
      end
      request
    end

    def get_layer_rgeoserver( name, current_tenant = Apartment::Tenant.current )

      require 'net/http'
      require 'uri'

      current_tenant = 'geoworks' if current_tenant.empty? || current_tenant == 'public'
      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:8080/geoserver/rest/workspaces/#{current_tenant}/datastores/#{current_tenant}/featuretypes.json")
      request = Net::HTTP::Get.new(uri)
      request.basic_auth(ENV['GEOSERVER_USER'], ENV['GEOSERVER_PASSWORD'])
      req_options = {
        use_ssl: uri.scheme == "https",
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      @layers = JSON.parse(response.body)

      puts ''
      puts ' ********* layers SEGUNDO ********* '
      p @layers
      puts ' ********* ' 
      puts ''

      @layers['featureTypes']['featureType'].each do |layer_name|
        puts ''
        puts ' ********* layers TERCERO EACH ********* '
        p "SOLO PARA REVISAR QUE INGRESA"
        puts ' ********* ' 
        puts ''
        if name == layer_name['name']
          puts ''
          puts ' ********* if name == layer_name[name] CUARTO ********* '
          p "ACA"
          p "RESPONSE"
          p response
          puts ' ********* ' 
          puts ''
          return [true, response.code]
        end
      end
      puts ''
      puts ' ********* FINALIZA EACH QUINTO ********* '
      p "ACA"
      puts ' ********* ' 
      puts ''
      return [false, response.code]
    end

    def add_layer_geoserver( name_layer, current_tenant = Apartment::Tenant.current )
      require 'net/http'
      require 'uri'
      current_tenant = 'geoworks' if current_tenant.empty? || current_tenant == 'public'
      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:8080/geoserver/rest/workspaces/#{current_tenant}/datastores/#{current_tenant}/featuretypes")
      request = Net::HTTP::Post.new(uri)
      request.basic_auth(ENV['GEOSERVER_USER'], ENV['GEOSERVER_PASSWORD'])
      request.content_type = "text/xml"
      request.body = "<featureType><name>#{name_layer}</name><latLonBoundingBox><minx>-180</minx><maxx>180</maxx><miny>-90</miny><maxy>90</maxy><crs>EPSG:4326</crs></latLonBoundingBox></featureType>"
      req_options = {
        use_ssl: uri.scheme == "https",
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      return [response.body, response.code]
    end

    def destroy_layer_geoserver ( name_layer, current_tenant = Apartment::Tenant.current )
      require 'net/http'
      require 'uri'
      #http://localhost:8080/geoserver/rest/workspaces/incorp/layers/plantacion
      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:8080/geoserver/rest/workspaces/#{current_tenant}/layers/#{name_layer.parameterize}?recurse=true")
      request = Net::HTTP::Delete.new(uri)
      request.basic_auth(ENV['GEOSERVER_USER'], ENV['GEOSERVER_PASSWORD'])
      req_options = {
        use_ssl: uri.scheme == 'https',
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
    end
  end
end
