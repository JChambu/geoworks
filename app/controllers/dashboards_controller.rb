class DashboardsController < ApplicationController
  before_action :set_project_type
  before_action :set_dashboard, only: [:show, :edit, :update, :destroy]


  # GET /dashboards
  # GET /dashboards.json

  def maps
  end

  def send_alerts
    @to = params[:to]
    @name_corp = params[:name_corp]
    @logo_corp = params[:logo_corp]
    @header_content = params[:header_content]
    @html_content = params[:html_content]
    @img_attach_src = params[:img_attach_src]
    @plain_content = params[:plain_content]
    UserMailer.send_alert(@to,@name_corp,@logo_corp,@header_content,@html_content,@img_attach_src,@plain_content).deliver_now
  end

  def send_report
      require 'net/http'
      require 'uri'
      uri = URI.parse(ENV['API_REPORTS_URL'])
      request = Net::HTTP::Post.new(uri)
     # request.basic_auth(ENV['usuario'], ENV['contraseña'])
      request.content_type = "application/json"
      req_options = {responseType: 'blob'}
      request.body = params.to_json
      #req_options = {
        #use_ssl: uri.scheme == "https",
      #}
      response = Net::HTTP.start(uri.hostname, uri.port ,req_options) do |http|
        http.request(request)
      end

      send_data(response.body)
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

      @fields = ProjectField.where(project_type_id: @project_type.id).order(:sort)
      # Busca el rol del usuario
      customer_name = Apartment::Tenant.current
      Apartment::Tenant.switch 'public' do
        customer_id = Customer.where(subdomain: customer_name).pluck(:id)
        @user_rol = UserCustomer
          .where(user_id: current_user.id)
          .where(customer_id: customer_id)
          .pluck(:role_id)
          .first
      end
      # Campos de los proyectos que están por encima del proyecto actual (se quitó esa restricción)
      # Se agregó restricción de proyectos compartidos
      @projects_shared = ProjectType
        .joins(:has_project_types)
        .where(has_project_types: {user_id: current_user.id})
        .pluck(:id)
      @top_level_fields = ProjectField
        .joins(:project_type)
        .where.not(project_type_id: @project_type.id)
        .where(project_type_id: @projects_shared)
        .order('project_types.level DESC','project_types.id', :sort)

      @table_configuration = TableConfiguration
        .where(project_type_id: @project_type.id)
        .where(user_id: current_user.id)

      @current_tenant = Apartment::Tenant.current

      @project_filters = ProjectFilter.where(project_type_id: @project_type.id).where(user_id: current_user.id).first

      if !@project_filters.nil?

        # Arma el filtro por atributo
        if !@project_filters.properties.nil?
          @project_filters.properties.to_a.each do |prop|
            @user_attribute_filter = "#{prop[0]}|=|#{prop[1]}"
          end
        end

        # Arma los filtros intercapa
        if !@project_filters.cross_layer_filter_id.nil?
          @cross_layer_filter = ProjectFilter.where(id: @project_filters.cross_layer_filter_id).where(user_id: current_user.id).first
          if !@cross_layer_filter.properties.nil?
            @cross_layer_filter.properties.to_a.each do |prop|
              @user_cross_layer_filter = "#{prop[0]}|=|#{prop[1]}"
            end
          end
          @cross_layer = ProjectType.where(id: @cross_layer_filter.project_type_id).pluck(:name_layer).first
        end

      end
      @extent = Project.geometry_bounds(@project_type.id, current_user.id, attribute_filters = '', filtered_form_ids = '', from_date = '', to_date = '', intersect_width_layers = 'false', active_layers = '', filters_layers = {} ,timeslider_layers = {})
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
      @project_type = ProjectType.joins(:has_project_types).where(id: params[:project_type_id]).where(has_project_types: {user_id: current_user.id}).first
        session[:project_type_id] = @project_type.id if !@project_type.nil?
    else
        if session.has_key? :project_type_id
          @project_type = ProjectType.joins(:has_project_types).where(id: session[:project_type_id]).where(has_project_types: { user_id: current_user.id}).first
          @project_type = ProjectType.joins(:has_project_types).where(has_project_types: {user_id: current_user.id}).last if @project_type.nil?
        else
          @project_type = ProjectType.joins(:has_project_types).where(has_project_types: {user_id: current_user.id}).last
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
