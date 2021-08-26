class ProjectsController < ApplicationController
  before_action :set_project_type, only: [:index]
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  def search_data
    @user = Project.search_value_for_fields params
    render json: {data: @user}
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
        @project = Project.find(app_id)
        @project.disable_form
      end
      render json: {status: 'Deshabilitación completada.'}
    else
      render json: {status: 'Error. Faltan parámetros para completar la acción.'}
    end
  end

  # Crea un nuevo registro
  def create_form

    project_type_id = params[:project_type_id]
    project_status_id = params[:project_status_id]
    properties = JSON(params[:properties]) # FIXME: solución temporal a los values como string
    geom = params[:geom]['0'][:latLng]
    subforms = params[:subforms] # FIXME: los paremetros llegan como string

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
      points_array << points_array[0]
      points_array_str = points_array.join(', ')
      @new_geom = "POLYGON((#{points_array_str}))"
    end

    datetime = Time.zone.now

    properties['app_id'] = 0
    properties['app_usuario'] = current_user.id
    properties['app_estado'] = project_status_id.to_i
    properties['gwm_created_at'] = datetime.to_date
    properties['gwm_updated_at'] = datetime.to_date

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

        children = []
        subforms.each do |i, sf|

          project_data_children = ProjectDataChild.new
          project_data_children.properties = sf['properties']
          project_data_children.project_id = @project.id
          project_data_children.project_field_id = sf['field_id']
          project_data_children.user_id = current_user.id
          project_data_children.gwm_created_at = datetime
          project_data_children.gwm_updated_at = datetime

          if project_data_children.save
            children << project_data_children.id
          end

        end

      end

      @project_type.destroy_view
      @project_type.create_view

      render json: {status: 'Creación completada.', id: @project.id, children: children}

    else

      render json: {status: 'Error en la creación.', id: '', children: ''}

    end

  end

  # Actualiza la columna properties
  def update_form
    app_ids = params[:app_ids]
    properties = JSON(params[:properties]) # FIXME: solución temporal a los values como string
    subforms = params[:subforms] # FIXME: los paremetros llegan como string
    project_status_id = params[:project_status_id]

    if app_ids.present?

      if properties.present? || project_status_id.present?
        app_ids.each do |app_id|
          @project = Project.find(app_id)
          @project.update_form(properties, project_status_id.to_i)
        end
      end

      if subforms.present?
        subforms.each do |i, sf|
          child_id = sf['child_id']
          properties = sf['properties']
          @project_data_children = ProjectDataChild.find(child_id)
          @project_data_children.update_subform(properties)
        end
      end

      render json: {status: 'Actualización completada.'}

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
        points_array << points_array[0]
        points_array_str = points_array.join(', ')
        @new_geom = "POLYGON((#{points_array_str}))"
      end

      # Arma el properties con los campos calculados a modificar
      @new_properties = {}
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
              .where(calculated_field: '{"localidad":"54,419"}')
              .where(project_type_id: project_type_id)
              .pluck(:key)
              .first
            @new_properties[key_localidad] = []
          end
        end

      end
      @project.update_geom_and_calculated_fields(@new_geom, @new_properties)
    end

    @project_type.destroy_view
    @project_type.create_view
    render json: {status: 'Edición completada.'}

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
