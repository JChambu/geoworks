class Customer < ApplicationRecord

  validates :name, :subdomain, presence: true
  validates :subdomain, uniqueness: true 
  
  after_create :create_tenant, 

  MAPS = %w[here osm] 

  private

  def create_tenant
    Apartment::Tenant.create(subdomain)
  end
end
