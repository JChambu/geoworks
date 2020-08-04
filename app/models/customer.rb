class Customer < ApplicationRecord

  has_many :user_customers
  has_many :users, through: :user_customers

  validates :name, :subdomain, presence: true
  validates :subdomain, uniqueness: true

  after_create :create_tenant, :create_workspace_geoserver,

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

end
