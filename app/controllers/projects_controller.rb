class ProjectsController < ApplicationController
  before_action :set_project_type, only: [:index]
  before_action :set_project, only: [:show, :edit, :update, :destroy]

  def popup
    project_data = Project.find(params['project_id'].to_i)
     render json: {data: project_data }
  end

  # GET /projects
  # GET /projects.json
  def index
    
    authorize! :data, :visualizer
    @search = @project_type.projects.all
    @search = @search.search(params[:q])
    @projects = @search.result.paginate(:page => params[:page])
    @fields = ProjectField.where(project_type_id: params[:project_type_id])
    @project_type = params[:project_type_id]
 
    respond_to do |format|
      format.html
      format.csv { send_data @projects.to_csv, filename: "users-#{Date.today}.csv" }
          end
    end

  # GET /projects/1
  # GET /projects/1.json
  def show
  end

  # GET /projects/new
  def new
    authorize! :data, :new
    @project = Project.new(project_type_id: params[:format])
  end

  # GET /projects/1/edit
  def edit
    authorize! :data, :edit
  end

  # POST /projects
  # POST /projects.json
  def create
    @project = Project.new(project_params)

    respond_to do |format|
      if @project.save
        format.html { redirect_to @project, notice: 'Project was successfully created.' }
        format.json { render :show, status: :created, location: @project }
      else
        format.html { render :new }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /projects/1
  # PATCH/PUT /projects/1.json
  def update
    respond_to do |format|
      if @project.update(project_params)
        format.html { redirect_to projects_path(), notice: 'Project was successfully updated.' }
        format.json { render :show, status: :ok, location: @project }
      else
        format.html { render :edit }
        format.json { render json: @project.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /projects/1
  # DELETE /projects/1.json
  def destroy
    authorize! :data, :destroy
    @project.destroy
    respond_to do |format|
      format.html { redirect_to projects_url, notice: 'Project was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.

  def set_project_type
    @project_type = ProjectType.find(params[:project_type_id])
  end

  def set_project
      @project = Project.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_params
      @properties_keys = params[:project][:properties].keys
      params.require(:project).permit( :project_type_id, :properties => [@properties_keys])
    end
end
