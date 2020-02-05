module ProjectTypes::Scopes
  extend ActiveSupport::Concern

  included do
    scope :ordered, -> { order :name }
  end

  module ClassMethods
    def search_projects_for_tenant params
      @p = []
      Apartment::Tenant.switch params['customer_name'] do
        projects = ProjectType.all
        projects.each do |project|
          @p.push(project)
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
