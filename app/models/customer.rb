class Customer < ApplicationRecord

  has_many :user_customers
  has_many :users, through: :user_customers

  validates :name, :subdomain, presence: true
  validates :subdomain, uniqueness: true

  after_create :create_tenant, :create_workspace_geoserver, :create_datastore_geoserver, :add_url

  MAPS = %w[here osm]

  private

  def create_tenant
    return if subdomain == 'public'
    Apartment::Tenant.create(subdomain)
  end

  def create_workspace_geoserver

    require 'net/http'
    require 'uri'
    uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:8080/geoserver/rest/workspaces")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth('admin', ENV['GEOSERVER_ADMIN_PASSWORD'])
    request.content_type = "text/xml"
    request.body = "<workspace><name>#{subdomain}</name></workspace>"
    req_options = {
      use_ssl: uri.scheme == "https",
    }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    return [response.body, response.code]

  end

  def create_datastore_geoserver

    require 'net/http'
    require 'uri'
    uri = URI.parse("http://#{ENV['GEOSERVER_HOST']}:8080/geoserver/rest/workspaces/#{subdomain}/datastores")
    request = Net::HTTP::Post.new(uri)
    request.basic_auth('admin', ENV['GEOSERVER_ADMIN_PASSWORD'])
    request.content_type = "text/xml"
    request.body = "<dataStore><name>#{subdomain}</name><connectionParameters><host>#{ENV['POSTGRES_HOST']}</host><port>5432</port><database>#{ENV['POSTGRES_DATABASE']}</database><schema>#{subdomain}</schema><user>#{ENV['POSTGRES_USER']}</user><passwd>#{ENV['POSTGRES_PASSWORD']}</passwd><dbtype>postgis</dbtype></connectionParameters></dataStore>"
    req_options = {
      use_ssl: uri.scheme == "https",
    }
    response = Net::HTTP.start(uri.hostname, uri.port, req_options) do |http|
      http.request(request)
    end
    return [response.body, response.code]

  end

  def add_url

    self.url = "http://#{subdomain}.api.geoworks.com.ar/api/v1"
    save!

  end
end
