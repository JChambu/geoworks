module Roles::Scopes
  extend ActiveSupport::Concern
  
  module ClassMethods
    def search_roles_for_tenant params
      @r = []
      Apartment::Tenant.switch params['customer_name'] do
        roles = Role.all
        roles.each do |role|
          @r.push(role)
        end
      end
      @r
    end
  end
end
