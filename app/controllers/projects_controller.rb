class ProjectsController < ApplicationController
  before_action :set_project_type, only: [:index]
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  def search_data
    @user = Project.search_value_for_fields params
    render json: {data: @user}
  end

  def search_data_for_pdf
    top_level_project_type_ids = params[:top_level_project_type_ids]
    project_ids = params[:project_ids]
    filters_layers = params[:filters_layers]
    timeslider_layers = params[:timeslider_layers]
    projects = []
    top_level_project_type_ids.each do |project_type_id|
      data = Project
        .select('main.id AS cross_layer_record, sec.id, sec.properties, sec.project_type_id, sec.gwm_created_at, project_statuses.name AS status_name, project_statuses.color AS status_color')
        .from('projects main')
        .joins('INNER JOIN projects sec ON ST_Intersects(main.the_geom, sec.the_geom)')
        .joins('INNER JOIN project_statuses ON project_statuses.id = main.project_status_id')
        .where('main.id IN (?)', project_ids)
        .where('sec.project_type_id = ?', project_type_id)
        .where('main.row_active = ?', true)
        .where('main.current_season = ?', true)
        .where('sec.row_active = ?', true)
        .where('sec.current_season = ?', true)

      # Aplica filtros de la capa
          if !filters_layers.nil?
            active_layer = ProjectType.where(id: project_type_id).pluck(:name_layer).first
            filters_layer = filters_layers[active_layer]
            if !filters_layer.nil?
              filters_layer.each do |i,filter|
                field = filter["filter_field"]
                operator = filter["filter_operator"]
                value = filter["filter_value"]
                type = filter["field_type"]
                if(type == '5' and value!='null')
                  text = "(sec.properties->>'#{field}')::numeric #{operator}'#{value}' AND sec.properties->>'#{field}' IS NOT NULL"
                elsif (type == '3' and value!='null')
                  text = "to_date(sec.properties ->> '#{field}', 'DD/MM/YYYY') #{operator} to_date('#{value}','DD/MM/YYYY') AND sec.properties->>'#{field}' IS NOT NULL"
                else
                  text = "sec.properties ->> '#{field}' #{operator}'#{value}'"
                end
                text = text.gsub("!='null'"," IS NOT NULL ")
                text = text.gsub("='null'"," IS NULL ")
                data = data.where(text)
              end
            end
          end
          # Aplica filtros de time-slider de la capa
          if !timeslider_layers.nil?
            active_layer = ProjectType.where(id: project_type_id).pluck(:name_layer).first
            timeslider_layer = timeslider_layers[active_layer]
            if timeslider_layer.nil?
              data = data.where("sec.row_enabled = true")
            else
              from_date_layer = timeslider_layer["from_date"]
              to_date_layer = timeslider_layer["to_date"]
              if !from_date_layer.blank? && !to_date_layer.blank?
                data = data.where("sec.gwm_created_at BETWEEN '#{from_date_layer}' AND '#{to_date_layer}'")
              else
                data = data.where("sec.row_enabled = true")
              end
            end
          else
            data = data.where("sec.row_enabled = true")
          end

      projects << data
    end
    render json: projects
  end

  def has_ndvi_and_multipoints_role
    current_tenant = params[:current_tenant]
    current_tenant_id = Customer.where(subdomain: current_tenant).pluck(:id).first
    user_role_id = UserCustomer.where(user_id: current_user.id, customer_id: current_tenant_id).pluck(:role_id).first
    funcionalities_id = ModelType.where(name: 'funcionalities').pluck(:id).first
    ndvi_event_id = Event.where(name: 'ndvi').pluck(:id).first
    multipoints_event_id = Event.where(name: 'multipoints').pluck(:id).first

    find_ndvi_permission = Permission.where(role_id: user_role_id, event_id: ndvi_event_id, model_type_id: funcionalities_id)
    find_multipoints_permission = Permission.where(role_id: user_role_id, event_id: multipoints_event_id, model_type_id: funcionalities_id)

    render json: { find_ndvi_permission: find_ndvi_permission, find_multipoints_permission: find_multipoints_permission }
  end

  def get_coordinates
    app_id_polygon = params[:app_id_popup].to_i
    coordinates = Project.select("ST_AsText(ST_Transform(the_geom, 3857))").find(app_id_polygon).st_astext
    sentinel_link = "https://services.sentinel-hub.com/ogc/wms/93c606e3-c818-4834-9518-a1d02f6f92f7?geometry=#{coordinates}"

    render json: { sentinel_link: sentinel_link }
  end

  def get_random_points
    app_id_polygon = params[:app_id_popup].to_i
    points_numbers = params[:number_point_value].to_i

    coordinates = Project.select("ST_AsText(ST_GeneratePoints(the_geom, #{points_numbers}))").find(app_id_polygon).st_astext

    clean_coordinates = coordinates.scan(/-?\d+\.\d+/)
    geojson_coordinates = []
    clean_coordinates.each_slice(2) do |x, y|
      geojson_coordinates << [x.to_f, y.to_f]
    end

    render json: { geojson_coordinates: geojson_coordinates }
  end

  def save_randoms_multipoints
    multipoints_coordinates = params[:multipoints_coordinates].permit!.to_h
    project_to_save = params[:project_selected_value]
    number_points_save = params[:number_point_value]
    save_in_project = ProjectType.where(name: project_to_save).pluck(:id)
    properties_json = {"app_id"=>0, "app_usuario"=>current_user.id, "app_estado"=>0}

    count_sucess=0
    count_errors=0
    created_ids=[]

    multipoints_coordinates.map do |key, value|
      project_type_id = save_in_project[0].to_s
      project_status_id = ProjectStatus.where(project_type_id: project_type_id)
                          .order("CASE WHEN status_type = 'Predeterminado' THEN 0 ELSE 1 END, priority")
                          .pluck(:id)
                          .first
      properties = JSON(properties_json)
      parse_properties = JSON.parse(properties)
      new_geom = "POINT(#{value[0]} #{value[1]})"

      @project_type = ProjectType.find(project_type_id)
      @project = Project.new()

      datetime = Time.zone.now

      # Carga los valores
      @project['properties'] = parse_properties
      @project['project_type_id'] = project_type_id
      @project['user_id'] = current_user.id
      @project['the_geom'] = new_geom
      @project['project_status_id'] = project_status_id
      @project['gwm_created_at'] = datetime
      @project['gwm_updated_at'] = datetime

      if @project.save
        @project['properties'].merge!('app_id': @project.id)
        @project['properties'].merge!('app_estado': project_status_id.to_i)
        @project.save!

        count_sucess +=1
        created_ids.push(@project.id)
      else
        count_errors +=1
      end

    end

    @project_type.destroy_view
    @project_type.create_view
    @project.update_inheritable_statuses

    if count_errors > 0
      render json: {status: 'Nuevos registros:' + count_sucess.to_s+'. Errores:'+count_errors.to_s, id: created_ids}
    else
      render json: {status: 'Nuevos registros:' + count_sucess.to_s, id: created_ids}
    end

  end

  def change_gwm_created_at
    date_to_change = params[:date_to_change]
    time_string = "13:33:23"
    datetime_string = "#{date_to_change} #{time_string}"
    parsed_date = DateTime.strptime(datetime_string, "%d/%m/%Y %H:%M:%S")
    father_form = Project.find(params[:form_id].to_i)

    regex = /^\d{2}\/\d{2}\/\d{4}$/
    if date_to_change.match?(regex)
      father_form.update(gwm_created_at: parsed_date)
    end
  end

  # Elimina un registro (row_active = false)
  def destroy_form
    app_ids = params[:app_ids]
    project_type_id = params[:project_type_id]
    if app_ids.present? && project_type_id.present?
      app_ids.each do |app_id|
        @project = Project.find(app_id)
        @project.destroy_form
        @project_type = ProjectType.find(project_type_id)
        @project_type.destroy_view
        @project_type.create_view
      end
      render json: {status: 'Eliminación completada.'}
    else
      render json: {status: 'Error. Faltan parámetros para completar la acción.'}
    end
  end

  # Deshabilita un registro (row_enabled = false)
  def disable_form
    app_ids = params[:app_ids]
    if app_ids.present?
      app_ids.each do |app_id|
        project_row_enabled = Project.where(id: app_id).pluck(:row_enabled).first
        @project = Project.find(app_id)
        if(project_row_enabled)
          @project.disable_form
        else
          @project.enable_form
        end
      end
      render json: {status: 'Acción completada.'}
    else
      render json: {status: 'Error. Faltan parámetros para completar la acción.'}
    end
  end

  # Crea un nuevo registro
  def create_form
    count_sucess=0
    count_errors=0
    created_ids=[]
    project_type_id=0
    is_interpolate = params[:is_interpolate]
    @dat = params[:data]
    @dat.each do |i,data|
      project_type_id = data[:project_type_id]
      project_status_id = data[:project_status_id]
      properties = JSON(data[:properties]) # FIXME: solución temporal a los values como string
      geom = data[:geom]['0'][:latLng]
      subforms = data[:subforms] # FIXME: los paremetros llegan como string

      @project_type = ProjectType.find(project_type_id)
      @project = Project.new()

      # Arma la nueva geometría
      if @project_type.type_geometry == 'Point'
        @new_geom = "POINT(#{geom['lng']} #{geom['lat']})"
      else
        points_array = []
        geom.each do |a,x|
          point = "#{x[0]} #{x[1]}"
          points_array << point
        end
        if @project_type.type_geometry == 'Polygon'
          points_array << points_array[0]
          points_array_str = points_array.join(', ')
          @new_geom = "POLYGON((#{points_array_str}))"
        end
        if @project_type.type_geometry == 'LineString'
          points_array_str = points_array.join(', ')
          @new_geom = "LINESTRING(#{points_array_str})"
        end
      end

      datetime = Time.zone.now

      properties['app_id'] = 0
      properties['app_usuario'] = current_user.id
      properties['app_estado'] = project_status_id.to_i

      # Carga los valores
      @project['properties'] = properties
      @project['project_type_id'] = project_type_id
      @project['user_id'] = current_user.id
      @project['the_geom'] = @new_geom
      @project['project_status_id'] = project_status_id
      @project['gwm_created_at'] = datetime
      @project['gwm_updated_at'] = datetime

      if @project.save
        @project['properties'].merge!('app_id': @project.id)
        @project.save!

        if subforms.present?

          subforms_created = []
          subforms.each do |i, sf|

            project_field_id = sf['field_id']
            child_id = sf['child_id'].to_i
            properties = sf['properties']

            @project_data_children = ProjectDataChild.new
            @project_data_children.create_subform(properties, @project.id, project_field_id, current_user.id)
            subforms_created << @project_data_children.id
          end

        end
        count_sucess +=1
        created_ids.push(@project.id)
      else
        count_errors +=1
      end

    end

    if is_interpolate == 'true'
      @project_type.destroy_view_interpolation project_type_id
      @project_type.create_view_interpolation project_type_id
    else
      @project_type.destroy_view
      @project_type.create_view
      @project.update_inheritable_statuses
    end

    if is_interpolate == 'true'
      render js: "window.location = '#{project_types_path}'"
    else
      if count_errors >0
        render json: {status: 'Nuevos registros:'+count_sucess.to_s+'. Errores:'+count_errors.to_s, id: created_ids}
      else
        render json: {status: 'Nuevos registros:'+count_sucess.to_s, id: created_ids}
      end
    end

  end

  # Actualiza registros padre
  def update_form
    app_ids = params[:app_ids]
    properties = JSON(params[:properties]) # FIXME: solución temporal a los values como string
    subforms = params[:subforms] # FIXME: los paremetros llegan como string
    project_status_id = params[:project_status_id]
    field_ids = params[:subforms]&.values&.map { |subform| subform["field_id"].to_i }
    subtitles_ids_array = []

    if !field_ids.nil?
      field_ids.each do |fi|
        result = ProjectField.where("calculated_field ILIKE ? AND field_type_id = ?", "%#{fi}%", 11)

        while result.any?
          current_id = result.first.id
          subtitle_id = result.first.calculated_field.scan(/\d+/).map(&:to_i)
          subtitles_ids_array.concat(subtitle_id)
          result = ProjectField.where("calculated_field LIKE ? OR calculated_field ILIKE ? OR calculated_field ILIKE ? OR calculated_field ILIKE ?", "%,#{current_id}]%", "%,#{current_id},%", "%[#{current_id},%", "%[#{current_id}]%")
                               .where(field_type_id: 11)
        end
      end
      subtitles_ids_array.uniq!
      subtitles_ids_array.sort!
    end

    if app_ids.present?
      app_ids.each do |app_id|
        @project = Project.find(app_id)
        @project.update_form(properties, project_status_id.to_i)

        # Si vienen hijos, los crea o actualiza
        if subforms.present?
          @subforms_created = []
          subforms.each do |i, sf|
            project_field_id = sf['field_id']
            child_id = sf['child_id'].to_i
            properties = sf['properties']

            # Si el child_id es 0, el hijo se crea, sino se actualiza
            if child_id == 0
              @project_data_children = ProjectDataChild.new
              @project_data_children.create_subform(properties, app_id, project_field_id, current_user.id)
              @subforms_created << @project_data_children.id
            else
              @project_data_children = ProjectDataChild.find(child_id)
              @project_data_children.update_subform(properties)
            end
          end
        end
      end
      render json: {status: 'Actualización completada.', subforms_created: @subforms_created, subtitles_ids_array: subtitles_ids_array}
    else
      render json: {status: 'Faltan parámetros para completar la acción.'}
    end
  end


  def update_geom_and_calculated_fields

    data_to_edit = params[:data_to_edit]
    project_type_id = params[:project_type_id]
    @project_type = ProjectType.find(project_type_id)

    data_to_edit.each do |i, data|

      id = data['id']
      geom = data['latLng']
      calculated_fields = data['fields_calculated']
      @project = Project.find(id)

      # Arma la nueva geometría
      if @project_type.type_geometry == 'Point'
        @new_geom = "POINT(#{geom['lng']} #{geom['lat']})"
      else
        points_array = []
        geom.each do |a,x|
          point = "#{x[0]} #{x[1]}"
          points_array << point
        end
        if @project_type.type_geometry == 'Polygon'
          points_array << points_array[0]
          points_array_str = points_array.join(', ')
          @new_geom = "POLYGON((#{points_array_str}))"
        end
        if @project_type.type_geometry == 'LineString'
          points_array_str = points_array.join(', ')
          @new_geom = "LINESTRING(#{points_array_str})"
        end
      end

      # Arma el properties con los campos calculados a modificar
      @new_properties = {}

      unless calculated_fields.nil?
        calculated_fields.each do |n, field|

          key = field['field_key']
          value = field['value_calculated']
          remove_location = field['remove_location']
          loaded_value = @project.properties[key]

          if loaded_value != value
            @new_properties[key] = value
            # Elimina la localidad si se modifican provincia o departamento
            if remove_location
              key_localidad = ProjectField
                .where("calculated_field LIKE ?", "%localidad%")
                .where(project_type_id: project_type_id)
                .pluck(:key)
                .first
              unless key_localidad.nil?
                @new_properties[key_localidad] = []
              end
            end
          end
        end
      end
      @project.update_geom_and_calculated_fields(@new_geom, @new_properties)
    end

    @project_type.destroy_view
    @project_type.create_view
    render json: {status: 'Edición completada.'}

  end

  def split_geometry
    count_sucess=0
    count_errors=0

    data_to_edit = params[:data_to_edit]
    project_type_id = params[:project_type_id]
    @project_type = ProjectType.find(project_type_id)

    data_to_edit.each do |i, data|

      id = data['id']
      geom = data['latLng']
      calculated_fields = data['fields_calculated']
      @project_to_delete = Project.find(id)
      project_status_id = @project_to_delete.project_status_id
      properties = @project_to_delete.properties
      @childs_to_delete = ProjectDataChild.where(project_id: @project_to_delete.id)

      # Arma las nuevas geometrías
        points_array = []
        geom.each do |a,x|
          point = "#{x[0]} #{x[1]}"
          points_array << point
        end

        @last_point = nil
        points_array.each_with_index do |point,i|
          if i !=0
            points_array_str = "#{@last_point}, #{point}"
            @new_geom = "LINESTRING(#{points_array_str})"
            @project = Project.new()
            properties['app_id'] = 0
            properties['app_usuario'] = current_user.id
            properties['app_estado'] = project_status_id.to_i
            @project['properties'] = properties
            @project['project_type_id'] = project_type_id
            @project['user_id'] = current_user.id
            @project['the_geom'] = @new_geom
            @project['project_status_id'] = project_status_id
            datetime = Time.zone.now
            @project['gwm_created_at'] = datetime
            @project['gwm_updated_at'] = datetime

            # cambia campos calculados
              calculated_fields = data['fields_calculated']
              unless calculated_fields.nil?
                calculated_fields.each do |n, field|
                  key = field['field_key']
                  value = field['value_calculated'][i-1]
                  remove_location = field['remove_location']
                  loaded_value = @project.properties[key]

                  if loaded_value != value
                    @project.properties[key] = value
                    # Elimina la localidad si se modifican provincia o departamento
                    if remove_location
                      key_localidad = ProjectField
                        .where("calculated_field LIKE ?", "%localidad%")
                        .where(project_type_id: project_type_id)
                        .pluck(:key)
                        .first
                      unless key_localidad.nil?
                        @project.properties[key_localidad] = []
                      end
                    end
                  end
                end
              end

            if @project.save
              @project['properties'].merge!('app_id': @project.id)
              @project.save!
              count_sucess +=1
              @childs_to_delete.each do |c|
                @new_child = ProjectDataChild.new();
                @new_child['properties'] = c.properties
                @new_child['project_id'] = @project.id
                @new_child['project_field_id'] = c.project_field_id
                @new_child['user_id'] = c.user_id
                @new_child['gwm_created_at'] = c.gwm_created_at
                @new_child['gwm_updated_at'] = c.gwm_updated_at
                @new_child.save!
              end
            else
              count_errors +=1
            end

          end
          @last_point = point
        end

        @project_type.destroy_view
        @project_type.create_view
        @project.update_inheritable_statuses

        if count_errors >0
          render json: {status: count_errors.to_s + ' segmentos NO pudieron guardarse. La geometría original se ha mantenido'}
        else
          @project_to_delete.destroy
          @childs_to_delete.each do |c|
            c.destroy
          end
          render json: {status: count_sucess.to_s + ' nuevos segmentos'}
        end
    end
  end


  # Cambia el propietario del registro
  def change_owner
    app_ids = params[:app_ids]
    user_id = params[:user_id]
    if app_ids.present? && user_id.present?
      app_ids.each do |app_id|
        @project = Project.find(app_id)
        @project.change_owner(user_id.to_i)
      end
      render json: {status: 'Reasignación completada.'}
    else
      render json: {status: 'Error. Faltan parámetros para completar la acción.'}
    end
  end


  def search_statuses
    @project_statuses_data = ProjectStatus.where(project_type_id: params[:project_type_id]).order(status_type: :desc)
    render json: {data: @project_statuses_data}
  end

  def search_users
    customer_subdomain = Apartment::Tenant.current
    Apartment::Tenant.switch 'public' do
      @usuarios_corpo = User.joins(:customers).where(customers: {subdomain: customer_subdomain}).order(:name)
    end
    render json: {data: @usuarios_corpo}
  end

  def popup
    project_data = Project.find(params['project_id'].to_i)
    render json: {data: project_data }
  end

  # GET /projects
  # GET /projects.json
  def index

    authorize! :data, :visualizer
    @search = @project_type.projects.all
    @search = @search.search(params[:q])
    @projects = @search.result.paginate(:page => params[:page])
    @fields = ProjectField.where(project_type_id: params[:project_type_id])
    @project_type = ProjectType.find(params[:project_type_id])
    respond_to do |format|
      format.html
      format.csv { send_data @projects.to_csv, filename: "users-#{Date.today}.csv" }
    end
  end

  # GET /projects/1
  # GET /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    authorize! :data, :new
    @project = Project.new(project_type_id: params[:format])
  end

  # GET /projects/1/edit
  def edit
    authorize! :data, :edit
  end

  # POST /projects
  # POST /projects.json
  def create
    @project = Project.new(project_params)

    respond_to do |format|
      if @project.save
        format.html { redirect_to @project, notice: 'Project was successfully created.' }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /projects/1
  # PATCH/PUT /projects/1.json
  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to projects_path(), notice: 'Project was successfully updated.' }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.json
  def destroy
    authorize! :data, :destroy
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url, notice: 'Project was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def read_file
  end

  def mapping
  end

  def import
  end

  def download_errors
  end

  private
    # Use callbacks to share common setup or constraints between actions.

  def set_project_type
    @project_type = ProjectType.find(params[:project_type_id])
  end

  def set_project
    @project = Project.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def project_params
    @properties_keys = params[:project][:properties].keys
    params.require(:project).permit(:geom, :project_type_id, :properties => [@properties_keys]).merge(user_id: current_user.id)
  end
end
