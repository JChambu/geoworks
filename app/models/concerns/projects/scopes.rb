module Projects::Scopes
  extend ActiveSupport::Concern

  module ClassMethods

    def search_value_for_fields params

      table = params['table']
      field_key = params['project_field_key']
      project_type_id = params[:project_type_id]
      data = []

      puts "Datos que llegan a scope"
      puts table
      puts field_key
      puts project_type_id

      if table == 'Formularios'

        field = ProjectField
          .where(key: field_key)
          .where(project_type_id: project_type_id)
          .first

        if field.field_type.name == 'Listado (opción multiple)'
          data.push({field_type_name: field.field_type.name, values: ChoiceListItem.where(choice_list_id: field.choice_list_id).select('name as p_name')})
        else

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

          data.push({field_type_name: field.field_type.name, values: query})
        end

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
