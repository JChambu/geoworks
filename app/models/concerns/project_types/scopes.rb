module ProjectTypes::Scopes
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order :name }
  end

  module ClassMethods
    def search_projects_for_tenant customer_id
      @p = []
      customer_name = Customer.where(id: customer_id).pluck(:subdomain).first
      Apartment::Tenant.switch customer_name do
        projects = ProjectType.all
        projects.each do |project_type|
          @p.push(project_type)
        end
      end
      @p
    end

    def update_projects_for_tenante params
      Apartment::Tenant.switch params['customer_name'] do
      end
    end
  end
end
