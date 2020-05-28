module ProjectTypes::Geoserver
  extend ActiveSupport::Concern

  module ClassMethods
    def reload_rgeoserver
      require 'net/http'
      require 'uri'

      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:443/geoserver/rest/reload")
      request = Net::HTTP::Post.new(uri)
      request.basic_auth(ENV['GEOSERVER_USER'], ENV['GEOSERVER_PASSWORD'])
      request.content_type = "text/xml"
      req_options = {
        use_ssl: uri.scheme == "https",
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      [response.body, response.code]
    end

    def exist_layer_rgeoserver( name, current_tenant = Apartment::Tenant.current  )

      return false if name.nil?
      layer = ProjectType.get_layer_rgeoserver( name, current_tenant )
      request = [false, "400"]
      if layer[0]
        request = ProjectType.reload_rgeoserver
      else
        name_layer = ProjectType.where(name_layer: name)
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
      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:443/geoserver/rest/workspaces/#{current_tenant}/datastores/#{current_tenant}/featuretypes.json")
      request = Net::HTTP::Get.new(uri)
      request.basic_auth(ENV['GEOSERVER_USER'], ENV['GEOSERVER_PASSWORD'])
      req_options = {
        use_ssl: uri.scheme == "https",
      }
      response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
        http.request(request)
      end
      @layers = JSON.parse(response.body)
      @layers['featureTypes']['featureType'].each do |layer_name|
        if name == layer_name['name']
          return [true, response.code]
        end
      end
      return [false, response.code]
    end

    def add_layer_geoserver( name_layer, current_tenant = Apartment::Tenant.current )
      require 'net/http'
      require 'uri'
      current_tenant = 'geoworks' if current_tenant.empty? || current_tenant == 'public'
      uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:443/geoserver/rest/workspaces/#{current_tenant}/datastores/#{current_tenant}/featuretypes")
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
  end
end
