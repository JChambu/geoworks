class ProjectFieldsController < ApplicationController

  before_action :set_project_field, only: [:show, :edit, :update, :destroy, :geocoding]
  def index
      @project_type_id = params[:project_type_id]
      @project_fields = ProjectField.where(project_type_id: @project_type_id).order(:sort)

  end

  def new
    @project_field = ProjectField.new
    @project_subfield = @project_field.project_subfields.build
  end

  def create
  		@analytics_dashboard = AnalyticsDashboard.new

  		@analytics_dashboard['title'] = params['title']
  		@analytics_dashboard.save
  end

  def edit
      @project_fields = ProjectField.where(project_type_id: @project_type_id).order(:sort)
  end
  def show
      @projectFields = ProjectField.where(project_type_id: params[:id])
  end


  def  edit_multiple
      @project_type_id = params[:project_type_id]
      @projectFields = ProjectField.where(project_type_id: @project_type_id).order(:sort)
  end

  def update_multiple
  @project_type_id = params[:project_type_id]
    ProjectField.update(params[:Fields].keys, params[:Fields].values)
    redirect_to project_type_project_fields_path(@project_type_id)
  end

  def field_popup
    @fields = ProjectField.where(project_type_id: params[:project_type_id]).where(popup: true).pluck(:key) 
    render json: @fields
  end
  
  def set_project_field
    @project_field = ProjectField.find(params[:id])
    @project_subfields = @project_field.project_subfields.order(:sort)
  end
  
  def project_field_params
    params.require(:project_field).permit(:id,  project_subfields_attributes: [:id, :field_type_id, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id, :sort])
  end


end
