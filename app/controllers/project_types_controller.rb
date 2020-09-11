class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy]

  def search
    @project = ProjectType.all
    render json: {"data": @project}
  end

  def search_name_layer
    @project_name = ProjectType.where(name_layer: params[:name_projects]).pluck(:name)
    render json: {"data": @project_name}
  end

  def project_type_layers
    @projects = ProjectType
      .joins(:has_project_types)
      .where.not(name_layer: params[:name_projects])
      .where(enabled_as_layer: true)
      .where(has_project_types: {user_id: current_user.id})
      .ordered
    render json: {"data": @projects}
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

  def filters
    respond_to do |format|
      format.js
    end
  end

  def create_filters
    @field = "field"
    respond_to do |format|
      format.js
    end

  end

  def dashboard
  end

  def kpi

    @op_graph = params[:graph]
    @data_conditions = params[:data_conditions]
    filter_condition = []
    @querys = ''
    if @op_graph == 'true'
      @querys = ProjectType.kpi_new(params[:data_id], @op_graph, params[:size_box], params[:type_box], params[:dashboard_id], @data_conditions, current_user.id)
    else
      @querys = ProjectType.kpi_without_graph(params[:data_id], @op_graph, params[:size_box], params[:type_box], params[:dashboard_id],@data_conditions, current_user.id)
    end
  end

  def heatmap
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

  def filter_heatmap

    @data_conditions = params[:conditions]
    if !params[:heatmap_indicator].empty?

      @query_h = ProjectType.indicator_heatmap(params[:project_type_id], params[:heatmap_indicator], params[:size_box], params[:type_box], @data_conditions, current_user.id)
    else
      project_type_id = params[:project_type_id]
      type_box = params[:type_box]
      size_box = params[:size_box]
      @ct = Apartment::Tenant.current
      @arr1 = []
      if type_box == 'polygon'
        size_box.each do |a,x|
          z = []
          @a = a
          @x = x
          x.each do |b,y|
            @b = b
            @y = y
            z.push(y)
          end
          @arr1.push([z])
        end

        data = Project.
          where(project_type_id: project_type_id).
          where("shared_extensions.st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{@arr1}}'),4326), #{:the_geom})").
          where(row_active: true).
          where(current_season: true)
      else
        data = Project.
          where(project_type_id: project_type_id).
          where(row_active: true).
          where(current_season: true)
      end
      condition = params[:conditions]
      if !condition.blank?
        condition.each do |key|
          @s = key.split('|')
          @field = @s[0]
          @filter = @s[1]
          @value = @s[2]
          if (@filter == '<' || @filter == '>' || @filter == '>=' || @filter == '<=' )
            data =  data.where(" (properties->>'" + @field +"')::numeric" +  @filter +"#{@value}")
          else
            data =  data.where(" properties->>'" + @field +"'" +  @filter +"#{@value}")
          end
        end
      end
      @query_h = data.select("st_x(the_geom) as lng, st_y(the_geom) as lat, projects.properties->>'#{params[:heatmap_field]}' as count").group("projects.properties->>'#{params[:heatmap_field]}', the_geom").order('count')

    end
    @query_h
  end

  def maps

    if params[:data_id] == '2'
      @projects = Project.where(project_type_id: params[:data_id]).select("the_geom")
    else

      @projects = Project.where(project_type_id: params[:data_id]).select("st_x(the_geom) as x, st_y(the_geom)as y ")
    end

    if !params[:project_field].blank?
      project_field = params[:project_field]
      filter = params[:filter]
      input_value = params[:input_value]

      @projects = @projects.where("properties->>'" + project_field +  "' " + filter  + " ?", input_value)
    end
  end

  # GET /project_types
  # GET /project_types.json
  def index

    @has_project_types = HasProjectType.where(user_id: current_user.id).select(:project_type_id)
    @p =[]
    @has_project_types.each do |s| @p.push(s.project_type_id) end
    @project_types = ProjectType.order(:level).where(id: @p)
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
    @project_field.push(@project_type.project_fields.build({name: 'app_id', field_type_id: '1', hidden: true, read_only: true}))
    @project_field.push(@project_type.project_fields.build({name: 'app_estado', field_type_id: '1', hidden: true, read_only: true}))
    @project_field.push(@project_type.project_fields.build({name: 'app_usuario', field_type_id: '1', hidden: true, read_only: true}))
    @project_field.push(@project_type.project_fields.build({name: 'gwm_created_at', field_type_id: '3', hidden: true, read_only: true}))
    @project_field.push(@project_type.project_fields.build({name: 'gwm_updated_at', field_type_id: '3', hidden: true, read_only: true}))

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
        ProjectType.add_layer_geoserver(params[:project_type][:name_layer])
        format.html { redirect_to root_path(), notice: 'El proyecto se creó correctamente.' }
        format.json { render :show, status: :created, location: @project_type }
      else
        format.html { render :new, status: :no_created}
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end

  end

  # Actualiza el level del proyecto
  def update_level

    level = params[:level_data]
    level.each do |p, l|
      @project_type = ProjectType.find(p)
      @project_type.update_level!(l)
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
    @project_type.destroy
    redirect_to root_path()
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
      :name, :type_file, :latitude, :longitude, :name_layer, :address, :department, :province, :country, :enabled_as_layer, :layer_color,
      :type_geometry, { file: [] }, :tracking, :kind_file, :cover, :geo_restriction, :multiple_edition,
      project_fields_attributes: [
        :id, :field_type_id, :name, :required, :key, :cleasing_data, :georeferenced, :regexp_type_id, { roles_read: [] }, { roles_edit: [] }, :sort, :_destroy,
        :choice_list_id, :hidden, :read_only, :popup, :calculated_field, :data_script, :filter_field, :heatmap_field, :colored_points_field,
        project_subfields_attributes: [
          :id, :field_type_id, :name, :required, :key, :cleasing_data, :georeferenced, :regexp_type_id, { roles_read: [] }, { roles_edit: [] }, :sort, :_destroy,
          :choice_list_id, :hidden, :read_only, :popup, :calculated_field, :data_script
        ]
      ]
    ).merge(user_id: current_user.id)
  end
end
