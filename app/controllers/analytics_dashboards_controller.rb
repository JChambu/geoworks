class AnalyticsDashboardsController < ApplicationController
  before_action :set_dashboard
  before_action :set_analytics_dashboard, only: [:show, :edit, :update, :destroy]

  # GET /analytics_dashboards
  # GET /analytics_dashboards.json
  def index
    authorize! :indicators, :visualizer
    @analytics_dashboards = @dashboard.analytics_dashboards.all
  end

  # GET /analytics_dashboards/1
  # GET /analytics_dashboards/1.json
  def show
  end

  # GET /analytics_dashboards/new
  def new
    authorize! :indicators, :new
    @analytics_dashboard = @dashboard.analytics_dashboards.new
  end

  # GET /analytics_dashboards/1/edit
  def edit
    authorize! :indicators, :edit
  end

  # POST /analytics_dashboards
  # POST /analytics_dashboards.json
  def create
    @analytics_dashboard = @dashboard.analytics_dashboards.new(analytics_dashboard_params)
    @analytics_dashboard[:project_type_id] = params[:project_type_id]

    respond_to do |format|
      if @analytics_dashboard.save
        format.js
        format.html { redirect_to project_type_dashboard_analytics_dashboards_path(@project_type, @dashboard), notice: 'Analytics dashboard was successfully created.' }
        format.json { render :show, status: :created, location: @analytics_dashboard }
      else
        format.js { render :new }
      end
    end
  end

  # PATCH/PUT /analytics_dashboards/1
  # PATCH/PUT /analytics_dashboards/2.json
  def update
    respond_to do |format|
      if @analytics_dashboard.update(analytics_dashboard_params)
        format.js
        format.html { redirect_to @analytics_dashboard, notice: 'Analytics dashboard was successfully updated.' }
        format.json { render :show, status: :ok, location: @analytics_dashboard }
      else
        format.html { render :edit }
        format.json { render json: @analytics_dashboard.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /analytics_dashboards/1
  # DELETE /analytics_dashboards/1.json
  def destroy
    authorize! :indicators, :destroy
    @graphics_properties = GraphicsProperty.where(analytics_dashboard_id: @analytics_dashboard.id)
    respond_to do |format|
      if @graphics_properties.any?
        format.html { redirect_to project_type_dashboard_analytics_dashboards_path(@project_type, @dashboard), notice: 'El indicador está siendo utilizado por un gráfico.' }
        format.json { render json: @analytics_dashboard.errors, status: :unprocessable_entity }
      else
        @analytics_dashboard.destroy
        format.html { redirect_to project_type_dashboard_analytics_dashboards_path(@project_type, @dashboard), notice: 'El indicador se eliminó correctamente.' }
        format.json { head :no_content }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.

  def set_dashboard
    @project_type = ProjectType.find(params[:project_type_id])
    @dashboard = Dashboard.find(params[:dashboard_id])
  end

  def set_analytics_dashboard
    @analytics_dashboard = AnalyticsDashboard.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def analytics_dashboard_params
    params.require(:analytics_dashboard).permit(:title, :description, :project_field_id, :analysis_type_id, :chart_id, :graph, :card, :group_field_id, :condition_field_id, :filter_input, :input_value, :const_field, :project_type_id, :sql_sentence, :order_sql, :group_sql, :children, :conditions_sql, :sql_full, :kpi_type)
  end
end
