module Users::Scopes
  extend ActiveSupport::Concern

  module ClassMethods
    def save_filters params
      project_filters = ProjectFilter.new
      if !params[:data_name].nil?
        Apartment::Tenant.switch params['user']['customer_id'] do
          project_filters[:user_id] = params['id'].to_i
          project_filters[:project_type_id] = params[:project]['id'].to_i
          params[:data_name].each do |dd|
            project_filters[:properties] = {"#{dd}": "#{params[:data_name][dd]}"}

            project_filters.save
          end
        end
      end
    end
  end
end
