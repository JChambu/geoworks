class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy, :geocoding]

  # GET /project_types
  # GET /project_types.json


   def project_type_layers
     @projects = ProjectType.where.not(name:params[:name_projects]).where(enabled_as_layer: true)
   render json: {"data": @projects}
   end


  def share
    @project_type = ProjectType.find(params[:project_type_id])
    respond_to do |format|
      format.js
    end
  end

  def create_share

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
    # if !@data_conditions.nil?

    #   project_field = params[:data_conditions][:project_field]
    #   filter = params[:data_conditions][:filter]
    #   input_value = params[:data_conditions][:input_value]
    #   filter_condition = [project_field, filter, input_value]
    # end

    @querys = ''
    if @op_graph == 'true'
      @querys = ProjectType.kpi_new(params[:data_id], @op_graph, params[:size_box], params[:type_box], params[:dashboard_id], @data_conditions)
    else
      @querys = ProjectType.kpi_without_graph(params[:data_id], @op_graph, params[:size_box], params[:type_box], params[:dashboard_id],@data_conditions)
    end
  end

  def heatmap
  end


  def point_colors
  end


  def create_point_colors
    @query_point = Project.where(project_type_id: params[:project_type_id]).select("properties->>'#{params[:q][:project_field]}' as name").group("properties->>'#{params[:q][:project_field]}'").limit(10)
    respond_to do |format|
      format.js
    end
  end


  def create_heatmap
  end


  def filter_heatmap

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

      data = Project.joins("left outer join project_data_children on projects.id = project_data_children.project_id").where(project_type_id: project_type_id).where("st_contains(ST_SetSRID(ST_GeomFromGeoJSON('{\"type\":\"Multipolygon\", \"coordinates\":#{@arr1}}'),4326), #{:the_geom})")
    else
      data = Project.joins("left outer join project_data_children on projects.id = project_data_children.project_id").where(project_type_id: project_type_id)
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

    if !params[:heatmap_indicator].empty?

      @analytics = AnalyticsDashboard.where(id: params[:heatmap_indicator])

      @analytics.each do |f|
        if !f.sql_sentence.blank?

            if f.group_sql.blank?
              @field_group = "projects.properties->>'"+ f.group_field.key + "'"
            else
              @field_group = f.group_sql
            end
          if f.order_sql.blank?
            data = data.select(f.sql_sentence, "st_x(the_geom) as lng, st_y(the_geom) as lat").group(@field_group, :the_geom).order(@field_group)
          else
            @order_sql = f.order_sql
            data = data.select(f.sql_sentence, "st_x(the_geom) as lng, st_y(the_geom) as lat").group(@field_group, :the_geom).order(@order_sql)
          end
        else

          @field_select = analysis_type(f.analysis_type.name, f.project_field.key) + ' as count'
          @field_select += ", projects.properties->>'" + f.group_field.key + "' as name "
          @field_group = "projects.properties->>'"+ f.group_field.key + "'"

          data =  data.select(@field_select).group(@field_group).order(@field_group)
        end
        conditions_field = f.condition_field
        if !conditions_field.blank?
          data =  data.where(" projects.properties->>'" + conditions_field.name + "' " + f.filter_input + "'#{f.input_value}'")
        end

        @query_h = data
      end
    else


      @query_h = data.select("st_x(the_geom) as lng, st_y(the_geom) as lat, projects.properties->>'#{params[:heatmap_field]}' as count").group("projects.properties->>'#{params[:heatmap_field]}', the_geom").order('count')

    end

    #@query_h = Project.where(project_type_id: params[:project_type_id]).select("st_x(the_geom) as lng, st_y(the_geom) as lat, count(id) as count").group("properties->>'#{params[:heatmap_field]}', the_geom")


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

  def index

    @has_project_types = HasProjectType.where(user_id: current_user.id).select(:project_type_id)
    @p =[]
    @has_project_types.each do |s| @p.push(s.project_type_id) end 
    @project_types = ProjectType.where(id: @p)
    if !params[:search_project].nil? || !params[:search_project].blank?
      @project_types = @project_types.where("name ILIKE :name", name: "%#{params[:search_project]}%")
    end


    @project_types = @project_types.paginate(:page => params[:page])
    #@project_fulcrum = ProjectType.query_fulcrum
  end

  # GET /project_types/1
  # GET /project_types/1.json
  def show
  end

  # GET /project_types/new
  def new
    @project_type = ProjectType.new
  end

  # GET /project_types/1/edit
  def edit

  end

  # POST /project_types
  # POST /project_types.json
  def create
    params[:project_type][:name_layer] = params[:project_type][:name].gsub(/\s+/, '_').downcase
    @project_type = ProjectType.new(project_type_params)
    respond_to do |format|
      if @project_type.save

        HasProjectType.create(user_id: current_user.id, project_type_id: @project_type.id)
        ProjectType.add_layer_geoserver(params[:project_type][:name_layer])
        format.html { redirect_to project_types_path(), notice: 'Project type was successfully created.' }
        format.json { render :show, status: :created, location: @project_type }
      else
        format.html { render :new, status: :no_created}
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_types/1
  # PATCH/PUT /project_types/1.json
  def update
    respond_to do |format|
      if @project_type.update(project_type_params)
        format.html { redirect_to project_types_path(), notice: 'Project type was successfully updated.' }
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
    @project_type.destroy
    respond_to do |format|
      format.html { redirect_to project_types_url, notice: 'Project type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_project_type
    @project_type = ProjectType.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def project_type_params
    params.require(:project_type).permit(:name, :type_file,  :latitude, :longitude, :name_layer, :address, :department, :province, :country, :enabled_as_layer, :layer_color, :type_geometry, {file:[]}, fields_attributes: [:id, :field_type, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id])
  end
end
