class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy]

  # GET /project_types
  # GET /project_types.json

  def filters
    respond_to do |format|
      format.html
      format.js

    end
  end

  def dashboard
  end

  def kpi
    @querys=[]
    minx = params[:size_box][0].to_f
    miny = params[:size_box][1].to_f
    maxx = params[:size_box][2].to_f
    maxy = params[:size_box][3].to_f

    @analytics_charts = AnalyticsDashboard.where(project_type_id: params[:data_id], graph: params[:graph])
   
    @analytics_charts.each do |chart|

      sql = "project_type_id = #{params[:data_id]} " 
      
      if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?
        field_select = "properties->>'"+ chart.project_field.key+"'"
        field_select += ", choice_lists.label"
      else
        field_select = "properties->>'"+ chart.project_field.key+"'"
      end 
      analysis_type = chart.analysis_type.name

      sql += " and st_makeenvelope(#{minx}, #{maxy},#{maxx},#{miny},4326) && #{:the_geom}" 

      conditions_field = chart.condition_field

      if !conditions_field.blank?
        sql += " and properties->>'" + chart.project_field.key + "' " + chart.filter_input + "'#{chart.input_value}'"
      end

      if params[:graph] == "true"
        @group = "group"
      
        if chart.project_field.field_type == 'ChoiceField' and !chart.project_field.choice_list_id.nil?
        @join = ("join choice_lists  on (properties->>'#{chart.project_field.key}')::integer = choice_lists.id" )
        @data =   Project.joins(@join).where(sql).send( @group, field_select).count
      else
        @data =   Project.where(sql).send( @group, field_select).count
      end 
        chart_type = chart.chart.name
        @querys << { "title":"#{chart.title}", "type_chart":[chart_type],"data":@data}
      else
        @data =   Project.where(sql).send("select", field_select)
        @querys << { "title":"#{chart.title}", "data":@data, "id":"#{chart.id}"}
      end

    end
  end


  def maps

    @projects = Project.where(project_type_id: params[:data_id]).select("st_x(the_geom), st_y(the_geom), properties->>'status' as status, properties->>'05d5' as client_id, 
properties->>'f2b1' as razon_social,
properties->>'9e2f' as ejecutivo")

    if !params[:provincia].blank?
      @projects = @projects.where("properties->>'7926'=?", params[:provincia])
    end

  end

  def graph2
    ##  params[:data_id] = 'b4a38670-0fbc-45d6-a162-48517e4198ba'
    #  @query = ProjectType.graph2(params[:data_id])
  end


  def index
    @project_types = ProjectType.all
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
    @project_type = ProjectType.new(project_type_params)
    respond_to do |format|
      if @project_type.save
        format.html { redirect_to @project_type, notice: 'Project type was successfully created.' }
        format.json { render :show, status: :created, location: @project_type }
      else
        format.html { render :new }
        format.json { render json: @project_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_types/1
  # PATCH/PUT /project_types/1.json
  def update
    respond_to do |format|
      if @project_type.update(project_type_params)
        format.html { redirect_to @project_type, notice: 'Project type was successfully updated.' }
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
    params.require(:project_type).permit(:name, {file:[]}, fields_attributes: [:id, :field_type, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id]).merge(user_id: current_user.id)
  end
end
