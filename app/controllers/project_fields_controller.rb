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
    project_name = params[:project_name]
    @fields = ProjectField
          .select('DISTINCT main.*')
          .from('project_fields main INNER JOIN project_types sec ON sec.id = main.project_type_id')
          .where('main.popup = ?', true)
          .where('sec.name_layer = ?', project_name)
          .order('sort')
    @name = ProjectType.where(name_layer: params[:project_name]).pluck(:name)  

    fields_json = {}
    @fields.each do |field|
      fields_json[field.key] = field.name
    end
    data = {}
    data['project_name'] = @name
    data['fields_popup'] = fields_json

    render json: data
  end

  def set_project_field
    @project_field = ProjectField.find(params[:id])
    @project_subfields = @project_field.project_subfields.order(:sort)
  end

  def project_field_params
    params.require(:project_field).permit(:id,  project_subfields_attributes: [:id, :field_type_id, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id, :sort])
  end


end
