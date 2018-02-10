class ProjectTypesController < ApplicationController
  before_action :set_project_type, only: [:show, :edit, :update, :destroy]

  # GET /project_types
  # GET /project_types.json

  def kpi
    @querys=[]
    @data = Project.where(project_type_id: 115).select("properties->>'status'").group("properties->>'status'").count
    @data1 = Project.where(project_type_id: 115).select("properties->>'status'").group("properties->>'status'").count
  
    @querys << {"kpi1":@data}
     @querys << {"kpi2":@data1}
  end
  
  
  def maps
  # params[:data_id] = '10e64be4-f9c5-4f32-8505-523628c52d46'
#      @maps = ProjectType.records_maps(params[:data_id])
    @projects = Project.where(project_type_id: params[:data_id]).select("st_x(the_geom), st_y(the_geom)")

  end
 
  def graph2
    params[:data_id] = 'b4a38670-0fbc-45d6-a162-48517e4198ba'
    @query = ProjectType.graph2(params[:data_id])
  end

  def dashboard
    #@counts = ProjectType.counters(params[:id])

    @analytics = AnalyticsDashboard.where(project_type_id: params[:id])
    @data = []
    @analytics.each do |a|
      @type = a.analysis_type.name
      @field = "coalesce((" + a.fields + " )::numeric,0)" 
      @title = a.title.to_s
      
      @data << { "#{@title}": Project.where(project_type_id: params[:id]).send(@type,@field).round(3)}
    end
    @items = ProjectType.where(id: params[:id])
  end

  def index
   @project_types = ProjectType.all
   @project_types = @project_types.paginate(:page => params[:page])
   @project_fulcrum = ProjectType.query_fulcrum
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
