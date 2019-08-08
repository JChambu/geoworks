class DashboardsController < ApplicationController
  before_action :set_dashboard, only: [:show, :edit, :update, :destroy]
  before_action :set_project_type

  # GET /dashboards
  # GET /dashboards.json

  def create_graph

    respond_to do |f|
      f.html
      f.js
    end
  end

  def index
    @dashboards = @project_type.dashboards
  end

  # GET /dashboards/1
  # GET /dashboards/1.json
  def show

    @projects = Project.where(project_type_id: params[:project_type_id])
    if @project_type.type_geometry != 'Polygon'
    @extent = Project.where(project_type_id: params[:project_type_id]).select("min(st_x(the_geom)) as minx, 
                                                                               min(st_y(the_geom)) as miny, 
                                                                               max(st_x(the_geom)) as maxx, 
                                                                               max(st_y(the_geom)) as maxy").group(:project_type_id)
    end 
    @dashboard_id = params[:id]
    @current_tenant = Apartment::Tenant.current
  end

  # GET /dashboards/new
  def new
    @dashboard = @project_type.dashboards.new
  end

  # GET /dashboards/1/edit
  def edit
  end

  # POST /dashboards
  # POST /dashboards.json
  def create
    @dashboard = @project_type.dashboards.new(dashboard_params)

    respond_to do |format|
      if @dashboard.save
        format.html { redirect_to project_type_dashboards_path(@project_type), notice: 'Dashboard was successfully created.' }
        format.json { render :show, status: :created, location: @dashboard }
      else
        format.html { render :new }
        format.json { render json: @dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /dashboards/1
  # PATCH/PUT /dashboards/1.json
  def update
    respond_to do |format|
      if @dashboard.update(dashboard_params)
        format.html { redirect_to project_type_dashboards_path(@project_type), notice: 'Dashboard was successfully created.' }
        format.json { render :show, status: :ok, location: @dashboard }
      else
        format.html { render :edit }
        format.json { render json: @dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /dashboards/1
  # DELETE /dashboards/1.json
  def destroy
    @dashboard.destroy
    respond_to do |format|
      format.html { redirect_to dashboards_url, notice: 'Dashboard was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.

  def set_project_type
    @project_type = ProjectType.find(params[:project_type_id])
  end

  def set_dashboard
    @dashboard = Dashboard.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def dashboard_params
    params.require(:dashboard).permit(:name)
  end
end
