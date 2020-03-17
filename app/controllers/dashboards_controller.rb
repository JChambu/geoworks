class DashboardsController < ApplicationController
  before_action :set_project_type
  before_action :set_dashboard, only: [:show, :edit, :update, :destroy]


  # GET /dashboards
  # GET /dashboards.json

  def maps
  end

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
    @extent = []
    if !@project_type.nil?
      @projects = Project.where(project_type_id: @project_type.id)
      @extent = Project.geometry_bounds(@project_type.id, current_user.id)
      @current_tenant = Apartment::Tenant.current
      @project_filters = ProjectFilter.where(project_type_id: @project_type.id).where(user_id: current_user.id)
    end

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
    if !params[:project_type_id].nil?
      @project_type = ProjectType.where(id: params[:project_type_id]).first
        session[:project_type_id] = @project_type.id if !@project_type.nil?
    else
        if session.has_key? :project_type_id 
          @project_type = ProjectType.where(id: session[:project_type_id]).first
          @project_type = ProjectType.last if @project_type.nil?
        else
          @project_type = ProjectType.last
        end
    end
  end

  def set_dashboard
    if !@project_type.nil?
      @dashboard = @project_type.dashboards.first
    end
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def dashboard_params
    params.require(:dashboard).permit(:name)
  end
end
