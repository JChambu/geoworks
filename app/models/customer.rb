class Customer < ApplicationRecord


  has_many :user_customers
  has_many :users, through: :user_customers

  validates :name, :subdomain, :url, presence: true
  validates :subdomain, :url, uniqueness: true

  after_create :create_tenant

  MAPS = %w[here osm]

  private

  def create_tenant
    return if subdomain == 'public'
    Apartment::Tenant.create(subdomain)
  end
end
