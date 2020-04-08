module Roles::Scopes
  extend ActiveSupport::Concern
  
  module ClassMethods
    def search_roles_for_tenant customer_id
      @r = []
      customer_name = Customer.where(id: customer_id).pluck(:name).first
      Apartment::Tenant.switch customer_name do
        roles = Role.all
        roles.each do |role|
          @r.push(role)
        end
      end
      @r
    end
  end
end
