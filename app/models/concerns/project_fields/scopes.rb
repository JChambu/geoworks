module ProjectFields::Scopes
  extend ActiveSupport::Concern
  
  module ClassMethods
    def search_fields_for_tenant params
      @f = []
      Apartment::Tenant.switch params['customer_name'] do
        fields = ProjectField.where(project_type_id: params[:project_id])
        fields.each do |field|
          @f.push(field)
        end
      end
      @f
    end
  end
end
