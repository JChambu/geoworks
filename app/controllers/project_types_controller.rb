class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy]

  require 'json'

  def search
    @project = ProjectType.all
    render json: {"data": @project}
  end

  def search_name_layer
    @project_name = ProjectType.where(name_layer: params[:name_projects]).pluck(:name)
    render json: {"data": @project_name}
  end

  def project_type_layers

    # Busca todas las capas
    @projects = ProjectType
      .joins(:has_project_types)
      .where.not(name_layer: params[:current_layer])
      .where(enabled_as_layer: true)
      .where(has_project_types: {user_id: current_user.id})
      .ordered

    layers = {}

    # Cicla las capas y levanta los filtros
    @projects.each do |project|

      layer_filters = {}
      project_filters = ProjectFilter
        .where(project_type_id: project.id)
        .where(user_id: current_user.id)
        .first

      if !project_filters.nil?

        if !project_filters.properties.nil?
          project_filters.properties.each do |f|
            layer_filters[:attribute_filter] = "#{f[0]}|=|'#{f[1]}'"
          end
        end

        if project_filters.owner == true
          layer_filters[:owner_filter] = project_filters.owner
        end

        if !project_filters.cross_layer_filter_id.nil?

          cl_filter = {}

          cross_layer_filter = ProjectFilter
            .where(id: project_filters.cross_layer_filter_id)
            .where(user_id: current_user.id)
            .first

          cl_name = ProjectType.where(id: cross_layer_filter.project_type_id).pluck(:name_layer).first
          cl_filter[:cl_name] = cl_name

          if !cross_layer_filter.properties.nil?
            cross_layer_filter.properties.each do |f|
              cl_filter[:cl_attribute_filter] = "#{f[0]}|=|'#{f[1]}'"
            end
          end

          if cross_layer_filter.owner == true
            cl_filter[:cl_owner_filter] = cross_layer_filter.owner
          end

          layer_filters[:cl_filter] = cl_filter

        end

      end

      layers["layer_#{project.name_layer}"] = {
        "name": project.name,
        "layer": project.name_layer,
        "type_geometry": project.type_geometry,
        "color": project.layer_color,
        "layer_filters": layer_filters
      }

    end

    render json: layers
  end

  def share
    authorize! :project_types, :share
    @project_type = ProjectType.find(params[:project_type_id])
    respond_to do |format|
      format.js
    end
  end

  def create_share
    authorize! :project_types, :share
    user_share = params[:user_ids]
    user_unshare =params[:unshare_user_ids]
    project_type_id = params[:project_type_id]

    if !user_share.nil?
      user_share.each do |u|
        HasProjectType.create(user_id: u, project_type_id: project_type_id)
      end
    end
    if !user_unshare.nil?
      user_unshare.each do |uu|
        @user = HasProjectType.where(user_id: uu).where(project_type_id: project_type_id).select(:id).first
        @user.destroy
      end
    end
    respond_to do |format|
      format.js
    end
  end

  def geocoding

    if params[:q].present?
      geo = ProjectType.build_geom(params[:q], params[:id])
    end
  end

  def import_file
    @csv_load = ProjectType.read_csv(@project_type.file)
  end

  def export_geojson

    filter_value = params[:filter_value]
    filter_by_column = params[:filter_by_column]
    order_by_column = params[:order_by_column]
    project_type_id = params[:project_type_id]
    name_project = params[:name_project]
    type_box = params[:type_box]
    size_box = params[:size_box]
    attribute_filters = params[:attribute_filters]
    filtered_form_ids = params[:filtered_form_ids]
    from_date = params[:from_date]
    to_date = params[:to_date]
    fields = params[:fields]
    intersect_width_layers = params[:intersect_width_layers]
    active_layers = params[:active_layers]
    filters_layers = params[:filters_layers]
    timeslider_layers = params[:timeslider_layers]

    require 'rgeo/geo_json'

    data = Project
      .select('DISTINCT ON (main.id) main.id, ST_AsGeoJSON(main.the_geom) as geom')
      .from('projects main')
      .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
      .joins('INNER JOIN public.users ON users.id = main.user_id')
      .where('main.project_type_id = ?', project_type_id.to_i)
      .where('main.row_active = ?', true)
      .where('main.current_season = ?', true)

    # Agrega al select los campos visibles en la tabla
    fields.each do |f|
      data = data.select("main.properties -> '#{f}' AS #{f}")
    end

    data = ProjectTypesController.set_map_filter data, type_box, size_box
    @project_filter = ProjectFilter.where(project_type_id: project_type_id.to_i).where(user_id: current_user.id).first
    data = ProjectTypesController.set_project_filter data, @project_filter, current_user.id
    data = ProjectTypesController.set_time_slider data, from_date, to_date
    data = ProjectTypesController.set_filters_on_the_fly data, attribute_filters
    data = ProjectTypesController.set_filtered_form_ids data, filtered_form_ids
    data = ProjectTypesController.set_intersect_width_layers data, intersect_width_layers, active_layers, filters_layers, timeslider_layers

    # Aplica búsqueda del usuario
    if !filter_by_column.blank? && !filter_value.blank?
      data = data.where("TRANSLATE(main.properties ->> '#{filter_by_column}','ÁÉÍÓÚáéíóú','AEIOUaeiou') ilike translate('%#{filter_value}%','ÁÉÍÓÚáéíóú','AEIOUaeiou')")
    end

    # Aplica órden de los registros
    if !order_by_column.blank?
      field = ProjectField.where(key: order_by_column, project_type_id: project_type_id).first

      # TODO: se deben corregir los errores ortográficos almacenados en la db
      if field.field_type.name == 'Numérico' || field.field_type.name == 'Numerico'
        data = data
          .select("(main.properties ->> '#{order_by_column}')::numeric AS order")
          .order("(main.properties ->> '#{order_by_column}')::numeric")
      elsif field.field_type.name == 'Fecha'
        data = data
          .select(" to_date(main.properties ->> '#{order_by_column}','DD/MM/YYYY') AS order")
          .order("to_date(main.properties ->> '#{order_by_column}','DD/MM/YYYY')")
      else
        data = data
          .select("main.properties ->> '#{order_by_column}' AS order")
          .order("main.properties ->> '#{order_by_column}'")
      end
    else
      data = data.order("main.id")
    end

    file = {
      'type': 'FeatureCollection',
      'features': []
    }

    # Guardamos el resultado de la consulta en un array
    data_array = data.map(&:attributes)

    data_array.each do |row|

      # Extraemos id y geom y las eliminamos del hash
      id = row['id']
      geom = JSON.parse(row['geom'])
      row.delete('id')
      row.delete('geom')

      # Armamos el feature y lo agregamos al archivo
      feature = {
        'type': 'Feature',
        'id': id,
        'geometry': geom,
        'properties': row.compact
      }
      file[:features] << feature

    end

    respond_to do |format|
      format.json { send_data file.to_json, filename: "#{name_project}-#{Date.today}.geojson", type: "text/plain" }
    end
  end

  def filters
    respond_to do |format|
      format.js
    end
  end

  def create_filters

    # TODO: Acá debe llegar el grupo que contiene al campo, por ahora se está
    # diferenciando según si el project_field que llega tiene números o letras
    # ya que en hijos se usa key numérico y en padres key con letras

    @field = "field"
    @field_name = ''
    @table = ''

    if /^[0-9]+$/.match(params[:q][:project_field])

      @field_name = helpers.get_name_from_id(params[:q][:project_field]).name
      subform_key = params[:q][:project_field]
      subform_operator = params[:q][:filters]
      subform_value = params[:q][:input_value]
      field_type = params[:q][:field_type]
      project_type_id = params[:project_type_id]
      @project_field_id = helpers.get_field_id_from_id(params[:q][:project_field]).project_field_id
      @table = 'subform_filter'
    else
      @field_name = helpers.get_name_from_key(params[:q][:project_field]).name
      @table = 'form_filter'
    end

    respond_to do |format|
      format.js
    end
  end

  def create_quick_filters
    @field_status = "field"
    respond_to do |format|
      format.js
    end
  end

  def create_quick_filters_users
    @field_users = "field"
    respond_to do |format|
      format.js
    end
  end

  def get_geo_key
    if !ENV['GEOSERVER_AUTH_KEY'].nil?
      render json: {"data": ENV['GEOSERVER_AUTH_KEY']}
    else
      render json: {"data": ''}
    end
  end

  def get_filtered_form_ids
    filtered_form_ids_text = params[:filtered_form_ids_text]
    project_type_id = params[:project_type_id]
    from_date_subform = params[:from_date_subform]
    to_date_subform = params[:to_date_subform]
    # Aplica filtros de hijos
    ids_array = []
    if !filtered_form_ids_text.blank?
      filtered_form_ids_unique = {}
      final_array = []
      filtered_form_ids_text.each do |i, obj|

        key = obj.keys[0]
        if filtered_form_ids_unique[key].nil?
          new_array = []
          new_array.push(obj[key])
          filtered_form_ids_unique[key] = new_array
        else
          new_array = filtered_form_ids_unique[key]
          new_array.push(obj[key])
          filtered_form_ids_unique[key]= new_array
        end
      end

      #Comienza búsqueda de ids padres
      filtered_form_ids_unique.each do |i , filters|
        text = ""
        text_field = ""
        text_time = ""
        filters.each_with_index do |filter,index|
          if index > 0
            text += " AND "
          end
          parts = filter.split('|')
          subform_key = parts[0]
          subform_operator = parts[1]
          subform_value = parts[2]
          field_type = parts[3]
          if subform_key == 'gw_usario_subform'
            text += " project_data_children.user_id = '#{subform_value}'"
            text_field = " 1 = 1"
          else
            if(field_type == '5' and subform_value!='null')
              text += "(project_data_children.properties ->> '#{subform_key}')::numeric #{subform_operator}'#{subform_value}' AND project_data_children.properties ->> '#{subform_key}' IS NOT NULL";
            elsif (field_type == '3' and subform_value!='null')
              text += "to_date(project_data_children.properties ->> '#{subform_key}', 'DD/MM/YYYY') #{subform_operator} to_date('#{subform_value}','DD/MM/YYYY') AND project_data_children.properties ->> '#{subform_key}' IS NOT NULL";
            else
              text += "project_data_children.properties ->> '#{subform_key}' #{subform_operator}'#{subform_value}'";
            end
            text = text.gsub("!='null'"," IS NOT NULL ")
            text = text.gsub("='null'"," IS NULL ")
            text_field = " project_data_children.project_field_id = "+i
          end

        end
        if !from_date_subform.blank? || !to_date_subform.blank?
          text_time = "project_data_children.gwm_created_at BETWEEN '#{from_date_subform}' AND '#{to_date_subform}'"
        else
          text_time = "project_data_children.row_enabled = true"
        end

        #revisar por qué no funciona .uniq cambiarlo tal vez por select distinct
        ids = Project
          .joins(:project_data_child)
          .where(project_data_children: {row_active: true})
          .where(project_data_children: {current_season: true})
          .where(text)
          .where(text_field)
          .where(text_time)
          .where(projects: {project_type_id: project_type_id})
          .pluck(:id)
          .uniq

        if ids.blank?
          ids = [-1]
        end
        ids_array.push(ids)
      end
    end
    render json: {"data": ids_array}
  end

  def get_extent
    project_type_id = params[:project_type_id]
    attribute_filters = params[:attribute_filters]
    filtered_form_ids = params[:filtered_form_ids]
    from_date = params[:from_date]
    to_date = params[:to_date]
    intersect_width_layers = params[:intersect_width_layers]
    active_layers = params[:active_layers]
    filters_layers = params[:filters_layers]
    timeslider_layers = params[:timeslider_layers]
    data = Project.geometry_bounds(project_type_id, current_user.id, attribute_filters, filtered_form_ids, from_date, to_date, intersect_width_layers,active_layers,filters_layers,timeslider_layers)
    render json: {"data": data}
  end

  def dashboard
  end

  def get_kpi_without_graph_ids
    analytics_charts_ids = ProjectType.get_kpi_without_graph_ids(
      params[:project_type_id],
      params[:is_graph]
    )
    render json: {"data": analytics_charts_ids}
  end

  def kpi

    @op_graph = params[:graph]
    @data_conditions = params[:data_conditions]
    @filtered_form_ids = params[:filtered_form_ids]
    filter_condition = []
    from_date = params[:from_date]
    to_date = params[:to_date]
    from_date_subform = params[:from_date_subform]
    to_date_subform = params[:to_date_subform]
    @filter_children = params[:filter_children]
    @filter_user_children = params[:filter_user_children]
    timeslider_layers = params[:timeslider_layers]
    filters_layers = params[:filters_layers]
    @querys = ''

    if @op_graph == 'true'
      @querys = ProjectType.kpi_new(
        params[:graph_id],
        params[:data_id],
        @op_graph,
        params[:size_box],
        params[:type_box],
        params[:dashboard_id],
        @data_conditions,
        @filtered_form_ids,
        @filter_children,
        @filter_user_children,
        current_user.id,
        from_date,
        to_date,
        from_date_subform,
        to_date_subform,
        timeslider_layers,
        filters_layers,
        params[:intersect_width_layers],
        params[:active_layers]
      )
    else
      @querys = ProjectType.kpi_without_graph_one_by_one(
        params[:is_default],
        params[:data_id],
        @op_graph,
        params[:size_box],
        params[:type_box],
        params[:dashboard_id],
        @data_conditions,
        @filtered_form_ids,
        @filter_children,
        @filter_user_children,
        current_user.id,
        from_date, to_date,
        from_date_subform,
        to_date_subform,
        params[:indicator_id],
        timeslider_layers,
        filters_layers,
        params[:intersect_width_layers],
        params[:active_layers]
      )
    end
  end

  def search_father_children_and_photos_data

    project_type_id = params[:project_type_id]
    project_id = params[:app_id].to_i
    from_date_subforms = params[:from_date_subforms]
    to_date_subforms = params[:to_date_subforms]
    filter_children = params[:filter_children]
    filter_user_children = params[:filter_user_children]

    # Busca el rol del usuario
    customer_name = Apartment::Tenant.current
    Apartment::Tenant.switch 'public' do
      customer_id = Customer.where(subdomain: customer_name).pluck(:id)
      @user_rol = UserCustomer
        .where(user_id: current_user.id)
        .where(customer_id: customer_id)
        .pluck(:role_id)
        .first
    end

    # Busca los campos del padre
    father_fields = ProjectField.where(project_type_id: project_type_id).order(:sort)

    # Busca los datos almacenados en el properties de los padres
    unless project_id == 0
      father_properties = Project.where(id: project_id).pluck(:properties).first
    end

    father_fields_array = []

    father_fields.each do |f_field|

      # Si el rol del usuario está seleccionado o sino hay ningún rol seteado, se puede ver
      roles_read = (JSON.parse(f_field.roles_read)).reject(&:blank?)
      if roles_read.include?(@user_rol.to_s) || roles_read.blank?
        f_can_read = true
      else
        f_can_read = false
      end

      # Si el rol del usuario está seleccionado o sino hay ningún rol seteado, se puede editar
      roles_edit = (JSON.parse(f_field.roles_edit)).reject(&:blank?)
      if roles_edit.include?(@user_rol.to_s) || roles_edit.blank?
        f_can_edit = true
      else
        f_can_edit = false
      end

      # Si el tipo de campo es listado (simple, múltiple o anidado) arma un array con los otros valores posibles
      if f_field.field_type_id == 10 || f_field.field_type_id == 2

        id = f_field.choice_list_id

        other_possible_values = []
        choice_list = ChoiceList.find(id)
        choice_list_item  = ChoiceListItem.where(choice_list_id: choice_list.id)
        sorted_choice_list_items = choice_list_item.sort { |x, y| x[:name] <=> y[:name] } # Ordena los items

        # Arma el objeto
        sorted_choice_list_items.each do |row|

          # Si tiene listados anidados, los agrega
          if !row.nested_list_id.nil?

            @nested_items = []
            nested_choice_list = ChoiceList.find(row.nested_list_id)
            nested_choice_list_item  = ChoiceListItem.where(choice_list_id: nested_choice_list.id)
            nested_sorted_choice_list_items = nested_choice_list_item.sort { |x, y| x[:name] <=> y[:name] } # Ordena los items anidados
            nested_sorted_choice_list_items.each do |f|
              @nested_items << { "id": f.id, "name": f.name }
            end
            other_possible_values << { "id": row.id, "name": row.name, "nested_items": @nested_items }
          else
            other_possible_values << { "id": row.id, "name": row.name }
          end

        end

      end

      # Si el tipo de campo es subformulario, busca todos los hijos con sus fotos
      if f_field.field_type_id == 7

        # Busca los datos del los hijos
        children_data = ProjectDataChild
          .where(project_id: project_id)
          .where(project_field_id: f_field.id)
          .where(row_active: true)
          .where(current_season: true)
          .order(gwm_created_at: :desc)

        # Aplica time_slider para hijos
        unless from_date_subforms.blank? || to_date_subforms.blank?
          children_data = children_data.where("gwm_created_at BETWEEN '#{from_date_subforms}' AND '#{to_date_subforms}'")
        else
          children_data = children_data.where(row_enabled: true)
        end

        # Aplica filtros por hijos
        if !filter_children.blank?
          filter_children.each do |filter_child|
            filter_parts = filter_child.split('|')
            # verifica que el filtro corresponda al subformulario que se está iterando
            belongs_to_subfield = ProjectSubfield.where(id: filter_parts[0]).where(project_field_id: f_field.id).first
            if !belongs_to_subfield.nil?
              if(filter_parts[3] == '5' and filter_parts[2]!='null')
                text = "(properties ->> '"+filter_parts[0]+"')::numeric "+filter_parts[1]+"'"+filter_parts[2]+"' AND properties ->> '"+filter_parts[0]+"' IS NOT NULL";
              elsif (filter_parts[3] == '3' and filter_parts[2]!='null')
                text = "to_date(project_data_children.properties ->> '"+filter_parts[0]+"', 'DD/MM/YYYY') "+filter_parts[1]+" to_date('"+filter_parts[2]+"','DD/MM/YYYY') AND properties ->> '"+filter_parts[0]+"' IS NOT NULL";
              else
                text = "properties ->> '"+filter_parts[0]+"' "+filter_parts[1]+"'"+filter_parts[2]+"'";
              end
              text = text.gsub("!='null'"," IS NOT NULL ")
              text = text.gsub("='null'"," IS NULL ")
              children_data = children_data.where(text)
            end
          end
        end

        # Aplica filtros de usuario de hijos
        if !filter_user_children.blank?
          filter_user_children.each do |filter_child|
            children_data = children_data.where("user_id = "+filter_child)
          end
        end

        children_data_array = []

        children_data.each do |c_data|

          # Busca las fotos del hijo
          child_photos = PhotoChild
            .where(project_data_child_id: c_data.id)
            .where(row_active: true)
          child_photos_array = []
          child_photos.each do |c_photo|
            c_photo_hash = {}
            c_photo_hash['id'] = c_photo.id
            c_photo_hash['name'] = c_photo.name
            c_photo_hash['image'] = c_photo.image
            child_photos_array.push(c_photo_hash)
          end

          # Busca los campos del hijo
          child_fields = ProjectSubfield.where(project_field_id: f_field.id).order(:sort)

          child_fields_array = []

          child_fields.each do |c_field|

            # Si el rol del usuario está dentro de los roles que pueden ver el campo (o no hay ningún rol configurado), el campo se agrega al json
            roles_read = (JSON.parse(c_field.roles_read)).reject(&:blank?)
            if roles_read.include?(@user_rol.to_s) || roles_read.blank?
              c_can_read = true
            else
              c_can_read = false
            end

            # Si el rol del usuario está seleccionado o sino hay ningún rol seteado, se puede editar
            roles_edit = (JSON.parse(c_field.roles_edit)).reject(&:blank?)
            if roles_edit.include?(@user_rol.to_s) || roles_edit.blank?
              c_can_edit = true
            else
              c_can_edit = false
            end

            if c_field.field_type_id == 10 || c_field.field_type_id == 2

              id = c_field.choice_list_id

              other_possible_values = []
              choice_list = ChoiceList.find(id)
              choice_list_item  = ChoiceListItem.where(choice_list_id: choice_list.id)
              sorted_choice_list_items = choice_list_item.sort { |x, y| x[:name] <=> y[:name] } # Ordena los items

              # Arma el objeto
              sorted_choice_list_items.each do |row|

                # Si tiene listados anidados, los agrega
                if !row.nested_list_id.nil?

                  @nested_items = []
                  nested_choice_list = ChoiceList.find(row.nested_list_id)
                  nested_choice_list_item  = ChoiceListItem.where(choice_list_id: nested_choice_list.id)
                  nested_sorted_choice_list_items = nested_choice_list_item.sort { |x, y| x[:name] <=> y[:name] } # Ordena los items anidados
                  nested_sorted_choice_list_items.each do |f|
                    @nested_items << { "id": f.id, "name": f.name }
                  end
                  other_possible_values << { "id": row.id, "name": row.name, "nested_items": @nested_items }
                else
                  other_possible_values << { "id": row.id, "name": row.name }
                end

              end

            end

            # Busca los datos del hijo
            child_properties = c_data[:properties]
            child_value = child_properties[c_field.id.to_s]

            c_data_hash = {}
            c_data_hash['field_id'] = c_field.id
            c_data_hash['name'] = c_field.name
            c_data_hash['value'] = child_value
            c_data_hash['other_possible_values'] = other_possible_values if c_field.field_type_id == 10 || c_field.field_type_id == 2
            c_data_hash['field_type_id'] = c_field.field_type_id
            c_data_hash['required'] = c_field.required
            c_data_hash['read_only'] = c_field.read_only
            c_data_hash['can_read'] = c_can_read
            c_data_hash['can_edit'] = c_can_edit
            c_data_hash['hidden'] = c_field.hidden
            c_data_hash['data_script'] = c_field.data_script
            c_data_hash['calculated_field'] = c_field.calculated_field

            child_fields_array.push(c_data_hash)

          end # Cierra child_fields.each

          children_data_hash = {}
          children_data_hash['children_id'] = c_data.id
          children_data_hash['children_gwm_created_at'] = c_data.gwm_created_at
          children_data_hash['children_fields'] = child_fields_array
          children_data_hash['children_photos'] = child_photos_array
          children_data_hash

          children_data_array.push(children_data_hash)

        end # Cierra children_data.each

        father_data = children_data_array

      else

        # Si el project_id es 0, se están editando múltiples registros por lo que se devuelven los values vacíos
        unless project_id == 0
          father_data = father_properties[f_field.key]
        else
          if f_field.field_type_id == 2 || f_field.field_type_id == 10
            father_data = []
          else
            father_data = ''
          end
        end

      end

      father_field_hash = {}
      father_field_hash['field_id'] = f_field.id
      father_field_hash['name'] = f_field.name
      father_field_hash['field_type_id'] = f_field.field_type_id
      father_field_hash['value'] = father_data
      father_field_hash['other_possible_values'] = other_possible_values if f_field.field_type_id == 10 || f_field.field_type_id == 2
      father_field_hash['required'] = f_field.required
      father_field_hash['read_only'] = f_field.read_only
      father_field_hash['can_read'] = f_can_read
      father_field_hash['can_edit'] = f_can_edit
      father_field_hash['hidden'] = f_field.hidden
      father_field_hash['data_script'] = f_field.data_script
      father_field_hash['calculated_field'] = f_field.calculated_field
      father_field_hash['key'] = f_field.key
      father_fields_array.push(father_field_hash)

    end

    # Busca las fotos del padre
    father_photos = Photo
      .where(project_id: project_id)
      .where(row_active: true)

    father_photos_array = []

    father_photos.each do |f_photo|
      f_photo_hash = {}
      f_photo_hash['id'] = f_photo.id
      f_photo_hash['name'] = f_photo.name
      f_photo_hash['image'] = f_photo.image
      father_photos_array.push(f_photo_hash)
    end

    unless project_id == 0
      father_status = Project
        .joins(:project_status)
        .where(id: project_id)
        .pluck(:project_status_id, :name, :color)
        .first
    end

    father_status_hash = {}

    unless project_id == 0
      father_status_hash['status_id'] = father_status[0]
      father_status_hash['status_name'] = father_status[1]
      father_status_hash['status_color'] = father_status[2]
    else
      father_status_hash['status_id'] = ''
      father_status_hash['status_name'] = ''
      father_status_hash['status_color'] = ''
    end

    unless project_id == 0
      row_enabled = Project.where(id: project_id).pluck(:row_enabled).first
    else
      row_enabled = ''
    end

    data = {}

    data['father_status'] = father_status_hash
    data['father_fields'] = father_fields_array
    data['father_photos'] = father_photos_array
    data['row_enabled'] = row_enabled

    render json: data
  end

  def search_data_dashboard
    # parámetros para utilizar este método en la búsqueda de interpolación
    is_interpolate = params[:is_interpolate]
    interpolate_field = params[:interpolate_field]
    # terminan parámetros de interpolación
    project_type_id = params[:project_type_id]
    offset_rows = params[:offset_rows]
    per_page_value = params[:per_page_value]
    filter_value = params[:filter_value]
    filter_by_column = params[:filter_by_column]
    order_by_column = params[:order_by_column]
    type_box = params[:type_box]
    size_box = params[:size_box]
    data_conditions = params[:data_conditions]
    filtered_form_ids = params[:filtered_form_ids]
    from_date = params[:from_date]
    to_date = params[:to_date]
    active_layers = params[:active_layers]
    intersect_width_layers = params[:intersect_width_layers]
    filters_layers = params[:filters_layers]
    timeslider_layers = params[:timeslider_layers]

    if is_interpolate
      select_text = "main.properties->>'"+interpolate_field+"' as interpolate_field, main.id";
    else
      select_text = 'DISTINCT main.* , project_statuses.color , public.users.name';
    end
    data = Project
      .select(select_text)
      .from('projects main')
      .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
      .joins('INNER JOIN public.users ON users.id = main.user_id')
      .where('main.project_type_id = ?', project_type_id.to_i)
      .where('main.row_active = ?', true)
      .where('main.current_season = ?', true)

    data = ProjectTypesController.set_map_filter data,type_box, size_box
    project_filter = ProjectFilter.where(project_type_id: project_type_id.to_i).where(user_id: current_user.id).first
    data = ProjectTypesController.set_project_filter data,project_filter, current_user.id
    data = ProjectTypesController.set_time_slider data, from_date, to_date
    data = ProjectTypesController.set_filters_on_the_fly data, data_conditions
    data = ProjectTypesController.set_filtered_form_ids data, filtered_form_ids
    data = ProjectTypesController.set_intersect_width_layers data, intersect_width_layers, active_layers, filters_layers, timeslider_layers

    if is_interpolate

      render json: {"data": data}

    else

      # Aplica búsqueda del usuario desde la tabla
      if !filter_by_column.blank? && !filter_value.blank?
        data = data.where("TRANSLATE(main.properties ->> '#{filter_by_column}','ÁÉÍÓÚáéíóú','AEIOUaeiou') ilike translate('%#{filter_value}%','ÁÉÍÓÚáéíóú','AEIOUaeiou')")
      end

      # Aplica órden de los registros desde la tabla
      if !order_by_column.blank?
        field = ProjectField.where(key: order_by_column, project_type_id: project_type_id).first

        # TODO: se deben corregir los errores ortográficos almacenados en la db
        if field.field_type.name == 'Numérico' || field.field_type.name == 'Numerico'
          data = data
            .except(:select).select("DISTINCT main.*, (main.properties ->> '#{order_by_column}')::numeric AS order")
            .order("(main.properties ->> '#{order_by_column}')::numeric")
        elsif field.field_type.name == 'Fecha'
          data = data
            .except(:select).select("DISTINCT main.*, to_date(main.properties ->> '#{order_by_column}','DD/MM/YYYY') AS order")
            .order("to_date(main.properties ->> '#{order_by_column}','DD/MM/YYYY')")
        else
          data = data
            .except(:select).select("DISTINCT main.*, main.properties ->> '#{order_by_column}' AS order")
            .order("main.properties ->> '#{order_by_column}'")
        end
      else
        data = data.order("main.id")
      end

      # Aplica limit y offset para paginar desde la tabla
      if !offset_rows.blank? && !per_page_value.blank?
        data = data
          .offset(offset_rows.to_i)
          .limit(per_page_value.to_i)
      end

      render json: {"data": data}
    end
  end

  def search_report_data

    project_type_id = params[:project_type_id].to_i
    filter_value = params[:filter_value]
    filter_by_column = params[:filter_by_column]
    order_by_column = params[:order_by_column]
    type_box = params[:type_box]
    size_box = params[:size_box]
    data_conditions = params[:data_conditions]
    from_date = params[:from_date]
    to_date = params[:to_date]
    filtered_form_ids = params[:filtered_form_ids]
    active_layers = params[:active_layers]
    intersect_width_layers = params[:intersect_width_layers]
    filters_layers = params[:filters_layers]
    timeslider_layers = params[:timeslider_layers]

    data = Project
      .select('DISTINCT ON (main.id) main.id, project_statuses.color as status_color')
      .from('projects main')
      .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
      .joins('INNER JOIN public.users ON users.id = main.user_id')
      .where('main.project_type_id = ?', project_type_id)
      .where('main.row_active = ?', true)
      .where('main.current_season = ?', true)
      .order("main.id")


    data = ProjectTypesController.set_map_filter data,type_box, size_box

    project_filter = ProjectFilter.where(project_type_id: project_type_id).where(user_id: current_user.id).first
    data = ProjectTypesController.set_project_filter data,project_filter, current_user.id
    data = ProjectTypesController.set_time_slider data,from_date,to_date
    data = ProjectTypesController.set_filters_on_the_fly data, data_conditions
    data = ProjectTypesController.set_filtered_form_ids data, filtered_form_ids
    data = ProjectTypesController.set_intersect_width_layers data, intersect_width_layers, active_layers, filters_layers, timeslider_layers

    report_data = {}

    project_types = ProjectType
      .where(enabled_as_layer: true)
      .where(:name_layer => active_layers).or(ProjectType.where(id: project_type_id))
      .order(level: :desc)

    p_data_array = []
    main_level = ProjectType.where(id: project_type_id).pluck(:level).first

    project_types.each do |p|

      if p.level >= main_level

        p_data = {}

        fields = ProjectField
          .joins(:project_type)
          .where(project_types: {enabled_as_layer: true})
          .where(project_type_id: p.id)
          .order('project_types.level DESC', :sort)

        if p.id != project_type_id
          data = data
            .joins("INNER JOIN projects #{p.name_layer} ON (shared_extensions.ST_Intersects(main.the_geom, #{p.name_layer}.the_geom))")
            .where("#{p.name_layer}.project_type_id = #{p.id}")
            .where("#{p.name_layer}.row_active = ?", true)
            .where("#{p.name_layer}.current_season = ?", true)
        end

        p_fields_array = []

        fields.each do |field|
          p_fields = {}

          if p.id != project_type_id
            data = data.select("#{p.name_layer}.properties ->> '#{field.key}' as #{p.name_layer}_#{field.key}")
          else
            data = data.select("main.properties ->> '#{field.key}' as #{p.name_layer}_#{field.key}")
          end

          p_fields['id'] = field.id
          p_fields['key'] = field.key
          p_fields['name'] = field.name
          p_fields['data_table'] = field.data_table
          p_fields['field_type_id'] = field.field_type_id
          p_fields['calculated_field'] = field.calculated_field
          p_fields_array.push(p_fields)
        end

        p_data['fields'] = p_fields_array
        p_data['name'] = p.name
        p_data['name_layer'] = p.name_layer
        p_data_array.push(p_data)
      end

    end
    report_data['thead'] = p_data_array
    report_data['tbody'] = data

    render json: report_data
  end


#COMIENZAN FUNCIONES PARA FILTROS
  def self.set_map_filter data, type_box, size_box
    # Aplica filtro geográfico
    if !type_box.blank? && !size_box.blank?
      if type_box == 'extent'
        minx = size_box[0].to_f if !size_box.nil?
        miny = size_box[1].to_f if !size_box.nil?
        maxx = size_box[2].to_f if !size_box.nil?
        maxy = size_box[3].to_f if !size_box.nil?
        data = data.where("shared_extensions.ST_Contains(shared_extensions.ST_MakeEnvelope(#{minx}, #{maxy}, #{maxx}, #{miny}, 4326), main.#{:the_geom})")
      else
        arr1 = []
        size_box.each do |a,x|
          z = []
          x.each do |b,y|
            z.push(y)
          end
          arr1.push([z])
        end
        data = data.where("shared_extensions.ST_Contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{arr1}}'), 4326), main.#{:the_geom})")
      end
    end

  data
  end

  def self.set_project_filter data, project_filter, user_id
    if !project_filter.nil?
      # Aplica filtro owner
      if project_filter.owner == true
        data = data.where('main.user_id = ?', user_id)
      end

      # Aplica filtro por atributo a la capa principal
      if !project_filter.properties.nil?
        project_filter.properties.to_a.each do |prop|
          data = data.where("main.properties ->> '#{prop[0]}' = '#{prop[1]}'")
        end
      end

      # Aplica filtro intercapa
      if !project_filter.cross_layer_filter_id.nil?
        cross_layer_filter = ProjectFilter.where(id: project_filter.cross_layer_filter_id).where(user_id: user_id).first

        # Cruza la capa principal con la capa secunadaria
        data = data
          .except(:from).from('projects main CROSS JOIN projects sec')
          .where('shared_extensions.ST_Intersects(main.the_geom, sec.the_geom)')
          .where('sec.project_type_id = ?', cross_layer_filter.project_type_id)
          .where('sec.row_active = ?', true)
          .where('sec.current_season = ?', true)

        # Aplica filtro por owner a la capa secundaria
        if cross_layer_filter.owner == true
          data = data.where('sec.user_id = ?', user_id)
        end

        # Aplica filtro por atributo a la capa secundaria
        if !cross_layer_filter.properties.nil?
          cross_layer_filter.properties.to_a.each do |prop|
            data = data.where("sec.properties->>'#{prop[0]}' = '#{prop[1]}'")
          end
        end
      end
    end
  data
  end

  def self.set_time_slider data, from_date, to_date
    # Aplica filtro de time_slider
    if !from_date.blank? || !to_date.blank?
      data = data.where("main.gwm_created_at BETWEEN '#{from_date}' AND '#{to_date}'")
    else
      data = data.where('main.row_enabled = ?', true)
    end

  data
  end

  def self.set_filters_on_the_fly data, data_conditions
    # Aplica filtros generados por el usuario
    if !data_conditions.blank?

      data_conditions.each do |key|
        s = key.split('|')
        field = s[0]
        filter = s[1]
        value = s[2]
        type = s[3]

        # Aplica filtro por campo usuario
        if field == 'app_usuario'
          data =  data.where("users.name " + filter + " '#{value}'")
        end

        # Aplica filtro por campo estado
        if field == 'app_estado'
          data =  data.where("project_statuses.name " + filter + " '#{value}' ")
        end

        # Aplica filtro por otro campo
        if field != 'app_usuario' && field != 'app_estado'
          if(type == "5" and value!='null')
            text = "(main.properties->>'" + field + "')::numeric" + filter + "'#{value}' AND main.properties->>'#{field}' IS NOT NULL"
          elsif (type == "3" and value!='null')
            text = "to_date(main.properties->>'" + field + "' , 'DD/MM/YYYY')" + filter + "to_date('#{value}', 'DD/MM/YYYY') AND main.properties->>'#{field}' IS NOT NULL"
          else
            text = "main.properties->>'" + field + "'" + filter + "'#{value}'"
          end
          text = text.gsub("!='null'"," IS NOT NULL ")
          text = text.gsub("='null'"," IS NULL ")
          data = data.where(text)
        end
      end
    end

  data
  end

  def self.set_filtered_form_ids data, filtered_form_ids
    # Aplica filtros de hijos
    if !filtered_form_ids.blank?
      final_array = []
      filtered_form_ids.each do |i, ids_array|
        if !final_array.blank?
          final_array = final_array & ids_array
        else
          final_array = ids_array
        end
      end
      if final_array.blank?
        final_array.push(-1)
      end
      final_array = final_array.to_s.gsub(/\[/, '(').gsub(/\]/, ')').gsub(/\"/, '')
      data = data.where("main.id IN #{final_array}")
    end

  data
  end

  def self.set_intersect_width_layers data, intersect_width_layers, active_layers, filters_layers, timeslider_layers
    # Aplica filtro de capas secundarias on the fly para el proyecto activo (INTERSECT DEL PROYECTO ACTIVO)
    if(intersect_width_layers=='true')
      current_tenant = Apartment::Tenant.current
      if !active_layers.nil?
        active_layers.each do |active_layer|
          active_layer_id = ProjectType.where(name_layer: active_layer).pluck(:id).first
          data = data.joins("INNER JOIN #{current_tenant}.projects intersect_"+active_layer+" ON ST_Intersects(main.the_geom, intersect_"+active_layer+".the_geom)")
          data = data.where("intersect_"+active_layer+".project_type_id = #{active_layer_id} AND intersect_"+active_layer+".row_active = true AND intersect_"+active_layer+".current_season = true")

          # Aplica filtros de la capa
          if !filters_layers.nil?
            filters_layer = filters_layers[active_layer]
            if !filters_layer.nil?
              filters_layer.each do |i,filter|
                field = filter["filter_field"]
                operator = filter["filter_operator"]
                value = filter["filter_value"]
                type = filter["field_type"]
                if(type == '5' and value!='null')
                  text = "(intersect_"+active_layer+".properties->>'#{field}')::numeric #{operator}'#{value}' AND intersect_"+active_layer+".properties->>'#{field}' IS NOT NULL"
                elsif (type == '3' and value!='null')
                  text = "to_date(intersect_"+active_layer+".properties ->> '#{field}', 'DD/MM/YYYY') #{operator} to_date('#{value}','DD/MM/YYYY') AND intersect_"+active_layer+".properties->>'#{field}' IS NOT NULL"
                else
                  text = "intersect_"+active_layer+".properties ->> '#{field}' #{operator}'#{value}'"
                end
                text = text.gsub("!='null'"," IS NOT NULL ")
                text = text.gsub("='null'"," IS NULL ")
                data = data.where(text)
              end
            end
          end
          # Aplica filtros de time-slider de la capa
          if !timeslider_layers.nil?
            timeslider_layer = timeslider_layers[active_layer]
            if timeslider_layer.nil?
              data = data.where("intersect_"+active_layer+".row_enabled = true")
            else
              from_date_layer = timeslider_layer["from_date"]
              to_date_layer = timeslider_layer["to_date"]
              if !from_date_layer.blank? && !to_date_layer.blank?
                data = data.where("intersect_"+active_layer+".gwm_created_at BETWEEN '#{from_date_layer}' AND '#{to_date_layer}'")
              else
                data = data.where("intersect_"+active_layer+".row_enabled = true")
              end
            end
          else
            data = data.where("intersect_"+active_layer+".row_enabled = true")
          end

        end
      end
    end
  data
  end

#TERMINAN FUNCIONES PARA FILTROS

  def heatmap
  end

  def interpolation
  end

  def point_colors
  end

  def create_point_colors
    field_name = "properties->>'#{params[:q][:project_field]}'"
    field_name = "project_statuses.name" if params[:q][:project_field] == 'app_estado'
    field_name = "users.name" if params[:q][:project_field] == 'app_usuario'
    @query_point = Project.joins(:user, :project_status).
      where(project_type_id: params[:project_type_id]).
      select("#{field_name} as name").
      group(field_name).
      limit(10)
    respond_to do |format|
      format.js
    end
  end

  def create_heatmap
  end

  def create_interpolation
  end

  def filter_heatmap

    @data_conditions = params[:conditions]
    if !params[:heatmap_indicator].empty?
      @query_h = ProjectType.indicator_heatmap(params[:project_type_id], params[:heatmap_indicator], params[:size_box], params[:type_box], @data_conditions, current_user.id ,params[:from_date], params[:to_date], params[:from_date_subform],params[:to_date_subform] , params[:filtered_form_ids] , params[:filter_children] , params[:filter_user_children] ,params[:filters_layers], params[:intersect_width_layers], params[:active_layers], params[:timeslider_layers])
    else
      project_type_id = params[:project_type_id]
      type_box = params[:type_box]
      size_box = params[:size_box]
      intersect_width_layers = params[:intersect_width_layers]
      filtered_form_ids = params[:filtered_form_ids]
      intersect_width_layers = params[:intersect_width_layers]
      active_layers = params[:active_layers]
      filters_layers = params[:filters_layers]
      timeslider_layers = [:timeslider_layers]

      data = Project
        .from('projects main')
        .where('main.project_type_id = ?', project_type_id)
        .where('main.row_active = ?', true)
        .where('main.current_season = ?', true)

      data = ProjectTypesController.set_map_filter data, type_box, size_box
      condition = params[:conditions]
      data = ProjectTypesController.set_filters_on_the_fly data, condition
      data = ProjectTypesController.set_filtered_form_ids data, filtered_form_ids
      data = ProjectTypesController.set_intersect_width_layers data, intersect_width_layers, active_layers, filters_layers, timeslider_layers

      @query_h = data.select("st_x(the_geom) as lng, st_y(the_geom) as lat, main.properties->>'#{params[:heatmap_field]}' as count").group("main.properties->>'#{params[:heatmap_field]}', the_geom").order('count')

    end
    @query_h
  end

  # GET /project_types
  # GET /project_types.json
  def index

    @has_project_types = HasProjectType.where(user_id: current_user.id).select(:project_type_id)
    @p =[]
    @has_project_types.each do |s| @p.push(s.project_type_id) end
    @project_types = ProjectType.order(id: :desc).where(id: @p)
    if !params[:search_project].nil? || !params[:search_project].blank?
      @project_types = @project_types.where("name ILIKE :name", name: "%#{params[:search_project]}%")
    end
    @project_types = @project_types.paginate(:page => params[:page])

  end

  # GET /project_types/1
  # GET /project_types/1.json
  def show
  end

  # GET /project_types/new
  def new

    authorize! :project_types, :new
    @project_type = ProjectType.new
    @project_field=[]
    @project_field.push(@project_type.project_fields.build({name: 'app_id', field_type_id: '5', hidden: true, read_only: true}))
    @project_field.push(@project_type.project_fields.build({name: 'app_estado', field_type_id: '5', hidden: true, read_only: true}))
    @project_field.push(@project_type.project_fields.build({name: 'app_usuario', field_type_id: '5', hidden: true, read_only: true}))

  end

  # GET /project_types/1/edit
  def edit

    authorize! :project_types, :edit
    @dashboard = @project_type.dashboards.first if @dashboard.nil?

  end

  # POST /project_types
  # POST /project_types.json
  def create

    params[:project_type][:name_layer] = params[:project_type][:name].gsub(/\s+/, '_').downcase

    if params[:project_type][:cover].present?
      encode_image
    end

    @project_type = ProjectType.new(project_type_params)

    respond_to do |format|
      if @project_type.save

        HasProjectType.create(user_id: current_user.id, project_type_id: @project_type.id)
        if current_user.id != 1
          HasProjectType.create(user_id: 1, project_type_id: @project_type.id)
        end
        ProjectType.add_layer_geoserver(params[:project_type][:name_layer])
        format.html { redirect_to project_types_path, notice: 'El proyecto se creó correctamente.' }
        format.json { render :new, status: :created, location: @project_type }
      else
        if @project_type.kind_file == true
          format.html { redirect_to project_types_path, notice: 'NO pudo crearse el proyecto.'}
          format.json { render json: @project_type.errors, status: :unprocessable_entity }
        else
          format.html { render :new, status: :no_created}
          format.json { render json: @project_type.errors, status: :unprocessable_entity }
        end
      end
    end

  end


  # PATCH/PUT /project_types/1
  # PATCH/PUT /project_types/1.json
  def update

    if params[:project_type][:cover].present?
      encode_image
    end

    respond_to do |format|
      if @project_type.update(project_type_params)
        ProjectType.exist_layer_rgeoserver @project_type.name_layer
        format.html { redirect_to edit_project_type_path(@project_type), notice: 'Los cambios se guardaron correctamente.' }
        format.json { render :show, status: :ok, location: @project_type }
      else
        format.html { render :edit }
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /project_types/1
  # DELETE /project_types/1.json
  def destroy
    authorize! :project_types, :destroy
    respond_to do |format|
      if @project_type.destroy
        ProjectType.destroy_layer_geoserver @project_type.name_layer
        format.html { redirect_to root_path(), notice: 'El proyecto se eliminó correctamente.' }
        format.json { render :show, status: :created, location: @project_type }
      else
        format.html { render :edit }
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end

  end

  def save_interpolation
    interpolation_name = params[:interpolation_name]
    interpolation_params = {}
    interpolation_params[:type_geometry] = "Polygon"
    interpolation_params[:tracking] = "0"
    interpolation_params[:enabled_as_layer] = "1"
    interpolation_params[:layer_color] = "#000000"
    interpolation_params[:geo_restriction] = "0"
    interpolation_params[:level] = "100"
    interpolation_params[:multiple_edition] = "0"
    interpolation_params[:enable_period] = "Nunca"
    interpolation_params[:notification_email] = ""
    interpolation_params[:name] = params[:name]
    interpolation_params[:name_layer] = params[:name].gsub(/\s+/, '_').downcase
    interpolation_params[:user_id] = current_user.id
    fields_interpolation = ["app_id","app_estado","app_usuario",interpolation_name]
    field_type_id = ["5","5","5","1"]
    hidden_field = ["1","1","1","0"]
    popup_field = ["0","0","0","1"]
    project_fields_attributes = []

    fields_interpolation.each_with_index do |f,i|
      new_field = {}
      new_field[:field_type_id] = field_type_id[i]
      new_field[:name] = f
      new_field[:required] = "0"
      new_field[:roles_read] = [""]
      new_field[:roles_edit] = [""]
      new_field[:sort] = "1"
      new_field[:choice_list_id] = ""
      new_field[:hidden] = hidden_field[i]
      new_field[:read_only] = "1"
      new_field[:popup] = popup_field[i]
      new_field[:data_table] = popup_field[i]
      new_field[:calculated_field] = ""
      new_field[:data_script] = ""
      new_field[:filter_field] = "1"
      new_field[:heatmap_field] = "0"
      project_fields_attributes.push(new_field)
    end

    interpolation_params[:project_fields_attributes] = project_fields_attributes

    @project_type = ProjectType.new(interpolation_params)
    @project_id_created = nil

    if @project_type.save

      HasProjectType.create(user_id: current_user.id, project_type_id: @project_type.id)
      if current_user.id != 1
        HasProjectType.create(user_id: 1, project_type_id: @project_type.id)
      end
      ProjectType.add_layer_geoserver(interpolation_params[:name_layer])
      @project_id_created = @project_type.id

    end
  render json: {"data": @project_id_created}
  end


  private

  # Use callbacks to share common setup or constraints between actions.
  def set_project_type
    @project_type = ProjectType.find(params[:id])
    @project_fields = @project_type.project_fields.order(:sort)
  end

  def encode_image
    params[:project_type][:cover] = Base64.strict_encode64(File.read(params[:project_type][:cover].path))
  end

  def project_type_params
    params.require(:project_type).permit(
      :name, :type_file, :latitude, :longitude, :name_layer, :address, :department, :province, :country, :enabled_as_layer, :layer_color, :notification_email,
      :type_geometry, { file: [] }, :tracking, :kind_file, :cover, :geo_restriction, :multiple_edition, :enable_period, :level, :iot,
      project_fields_attributes: [
        :id, :field_type_id, :name, :required, :key, :cleasing_data, :georeferenced, :regexp_type_id, { roles_read: [] }, { roles_edit: [] }, :sort, :_destroy,
        :choice_list_id, :hidden, :read_only, :popup, :data_table, :calculated_field, :data_script, :filter_field, :heatmap_field, :colored_points_field,
        project_subfields_attributes: [
          :id, :field_type_id, :name, :required, :key, :cleasing_data, :georeferenced, :regexp_type_id, { roles_read: [] }, { roles_edit: [] }, :sort, :_destroy,
          :choice_list_id, :hidden, :read_only, :popup, :filter_field, :calculated_field, :data_script
        ]
      ]
    ).merge(user_id: current_user.id)
  end
end
