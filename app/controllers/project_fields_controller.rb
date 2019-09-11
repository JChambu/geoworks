class ProjectFieldsController < ApplicationController

  def index
      @project_type_id = params[:project_type_id]
      @project_fields = ProjectField.where(project_type_id: @project_type_id).order(:sort)

  end

  def create
  		@analytics_dashboard = AnalyticsDashboard.new

  		@analytics_dashboard['title'] = params['title']
  		@analytics_dashboard.save
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


end
