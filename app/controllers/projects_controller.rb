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

  # Actualiza la columna properties
  def update_form

    # Padres
    app_ids = params[:app_ids]
    properties = JSON(params[:properties]) # FIXME: solución temporal a los values como string

    if app_ids.present? && properties.present?
      app_ids.each do |app_id|
        @project = Project.find(app_id)
        @project.update_form(properties)
      end
      render json: {status: 'Actualización completada.'}
    else
      render json: {status: 'Error. Faltan parámetros para completar la acción.'}
    end

    # Hijos
    subforms = params[:subforms] # FIXME: los paremetros llegan como string

    if subforms.present?
      subforms.each do |i, sf|
        child_id = sf['child_id']
        properties = sf['properties']
        @project_data_children = ProjectDataChild.find(child_id)
        if @project_data_children.update_subform(properties)
          render json: {status: 'Registro actualizado.'}
        else
          render json: {status: 'Error. No se pudo actualizar el registro.'}
        end
      end
    end

  end


  def update_geom

    geometries = params[:geometries_to_edit]
    project_type_id = params[:project_type_id]

    # Busca el tipo de geometría
    @project_type = ProjectType.find(project_type_id)

    # Cicla todas las geometrías a editar
    geometries.each do |i, row|

      app_id = row['id']
      geom = row['latLng']
      @project = Project.find(app_id)

      if @project_type.type_geometry == 'Point'

        new_geom = "POINT(#{geom['lng']} #{geom['lat']})"

      else

        points_array = []
        geom.each do |a,x|
          point = "#{x[0]} #{x[1]}"
          points_array << point
        end
        points_array << points_array[0]
        points_array_str = points_array.join(', ')
        new_geom = "POLYGON((#{points_array_str}))"

      end

      @project.update_geom new_geom

    end

    @project_type.destroy_view
    @project_type.create_view

    render json: {status: 'Edición completada.'}

  end


  def update_calculated_fields

    calculated_fields = params[:calculated_fields]
    project_type_id = params[:project_type_id]

    calculated_fields.each do |i, data|

      id = data['id']
      key = data['field_key']
      value = data['value_calculated']

      project = Project.find(id)

      value_cargado = project.properties[key]

      unless value_cargado == value

        # Buscamos el key de localidad
        key_localidad = ProjectField
          .where(calculated_field: '{"localidad":"54,419"}')
          .where(project_type_id: project_type_id)
          .pluck(:key)
          .first

        if !key_localidad.nil?
          new_properties = {
            key => value,
            key_localidad => ''
          }
        else
          new_properties = {
            key => value,
          }
        end

        project.update_form new_properties

      else

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

  # Cambia el estado del registro
  def change_status
    app_ids = params[:app_ids]
    status_id = params[:status_id]
    if app_ids.present? && status_id.present?
      app_ids.each do |app_id|
        @project = Project.find(app_id)
        @project.change_status(status_id.to_i)
      end
      render json: {status: 'Actualización completada.'}
    else
      render json: {status: 'Error. Faltan parámetros para completar la acción.'}
    end
  end


  def search_statuses
    @project_statuses_data = ProjectStatus.where(project_type_id: params[:project_type_id])
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
    params.require(:project).permit( :project_type_id, :properties => [@properties_keys]).merge(user_id: current_user.id)
  end
end
