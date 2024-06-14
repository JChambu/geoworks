module Projects::Scopes
  extend ActiveSupport::Concern

  module ClassMethods
    def search_value_for_fields params, current_user_id
      table = params['table']
      field_key = params['project_field_key']
      project_type_id = params[:project_type_id]
      if project_type_id.nil?
        name_layer = params[:name_layer]
        project_type_id = ProjectType.where(name_layer: name_layer).pluck(:id).first
      end
      data = []

      if table == 'Formularios'
        field = ProjectField.where(key: field_key).where(project_type_id: project_type_id).first

        select = "projects.properties->>'#{field.key}' as p_name" if field_key != 'app_usuario' && field_key !='app_estado'
        select = "users.name as p_name"  if field_key == 'app_usuario'
        select = "project_statuses.name as p_name" if field_key == 'app_estado'

        query = Project
               .joins(:user, :project_status)
               .where(project_type_id: project_type_id)
               .where(row_active: true)
               .where(current_season: true)
               .select(select)
               .group('p_name')
               .order('p_name')

        user_project_filters = ProjectFilter.where(user_id: current_user_id).where.not(properties: nil)

        if user_project_filters.present?
          filters = []
          user_project_filters.each do |upf|
            user_filter = upf.properties.values.first
            filters << user_filter if !user_filter.nil?
          end
        end

        query_to_select = []
        filters_flattened = filters.flatten
        filters_flattened.each do |fil|
          query.each do |qu|
            p_name_json = qu.attributes["p_name"]
            next if p_name_json.nil? || p_name_json.empty?
            pname = JSON.parse(p_name_json).first

            if fil == pname
              query_to_select << qu
            end
          end
        end

        data.push({field_type_name: field.field_type.name, values: query_to_select})
      else
        subfield = ProjectSubfield
          .joins(:project_field)
          .where(project_fields: {project_type_id: project_type_id})
          .where(id: field_key)
          .first

        if subfield.field_type.name == 'Listado (opción multiple)'
          data.push({field_type_name: subfield.field_type.name, values: ChoiceListItem.where(choice_list_id: subfield.choice_list_id).select('name as p_name')})
        else
          query = ProjectDataChild
            .select("project_data_children.properties->>'#{subfield.id}' as p_name")
            .joins(:project)
            .where(projects: {project_type_id: project_type_id})
            .where(row_active: true)
            .where(current_season: true)
            .group('p_name')
            .order('p_name')
          data.push({field_type_name: subfield.field_type.name, values: query})
        end
      end
      data
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
