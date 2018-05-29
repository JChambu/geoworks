class ProjectFieldsController < ApplicationController

  def index
      @projectFields = ProjectField.where(project_type_id: params[:id])

  end

  def create
  		@analytics_dashboard = AnalyticsDashboard.new

  		@analytics_dashboard['title'] = params['title']
  		@analytics_dashboard.save
  end

  def show

      @projectFields = ProjectField.where(project_type_id: params[:id])
  end

end
