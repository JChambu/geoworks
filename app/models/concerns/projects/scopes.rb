module Projects::Scopes
  extend ActiveSupport::Concern

  module ClassMethods

    def search_value_for_fields params
      @d = []
      field = ProjectField.find_by(key: params['project_field_id']) if params['project_field_id'] != 'app_usuario' && params['project_field_id'] !='app_estado'
      select = "projects.properties->>'#{field.key}' as p_name" if params['project_field_id'] != 'app_usuario' && params['project_field_id'] !='app_estado'
      select = "users.name as p_name"  if params['project_field_id'] == 'app_usuario' 
      select = "project_statuses.name as p_name" if params['project_field_id'] == 'app_estado'

      @ss = select
      @pp = params
      ddata = Project.joins(:user, :project_status).
        where(project_type_id: params[:project_type_id]).
        select(select).
      group('p_name')
      ddata.each do |d|
        @d.push(d)
      end
      @d
    end

    def search_properties_data_for_tenant params
      @d = []
      Apartment::Tenant.switch params['customer_name'] do
        field = ProjectField.find(params['project_field_id'])
        ddata = Project.where(project_type_id: params[:project_id]).
          select("properties->>'#{field.key}' as name").
          group('name')
        ddata.each do |d|
          @d.push(d)
        end
      end
      @d
    end
  end
end
