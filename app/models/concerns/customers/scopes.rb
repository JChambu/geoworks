module Customers::Scopes
  extend ActiveSupport::Concern

  def switch
    Apartment::Tenant.switch tenant_name do
      yield
    end
  end
end
