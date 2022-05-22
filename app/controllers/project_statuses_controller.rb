class ProjectStatusesController < ApplicationController

  before_action :set_project_status, only: [:destroy]
  before_action :load_project_types, except: :update_priority

  # GET /project_statuses
  # GET /project_statuses.json
  def index
    @project_statuses = @project_type.project_statuses.order(:priority).all
  end

  # GET /project_statuses/1
  # GET /project_statuses/1.json
  def show
  end

  # GET /project_statuses/new
  def new
    @project_status = @project_type.project_statuses.new
    @inherit_project_types = ProjectType.where("level < ?", @project_type.level)
  end

  # GET /project_statuses/1/edit
  def edit
    @project_status = @project_type.project_statuses.find(params[:id])
    @inherit_project_types = ProjectType.where("level < ?", @project_type.level)
  end

  # POST /project_statuses
  # POST /project_statuses.json
  def create
    @project_status = @project_type.project_statuses.new(project_status_params)

    respond_to do |format|
      if @project_status.save
        format.html { redirect_to project_type_project_statuses_path(@project_type.id), notice: 'Project status was successfully created.' }
        format.json { render :show, status: :created, location: @project_status }
      else
        format.html { render :new }
        format.json { render json: @project_status.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_statuses/1
  # PATCH/PUT /project_statuses/1.json
  def update
    @project_status = @project_type.project_statuses.find(params[:id])
    respond_to do |format|
      if @project_status.update(project_status_params)
        format.html { redirect_to project_type_project_statuses_path(@project_type.id), notice: 'Project status was successfully updated.' }
        format.json { render :show, status: :ok, location: @project_status }
      else
        format.html { render :edit }
        format.json { render json: @project_status.errors, status: :unprocessable_entity }
      end
    end
  end

  # Actualiza el priority del proyecto
  def update_priority

    priority = params[:priority_data]
    priority.each do |s, p|
      @project_status = ProjectStatus.find(s)
      @project_status.update_priority!(p)
    end

  end

  # DELETE /project_statuses/1
  # DELETE /project_statuses/1.json
  def destroy
    #@project_status = @project_type.project_statuses.find(params[:id])
    #
    @project_status.destroy
    respond_to do |format|
      format.html { redirect_to project_type_project_statuses_url(@project_type.id), notice: 'Project status was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def create_status_interpolation
    colors = params[:colors]
    names = params[:names]
    project_type_id = params[:project_type_id]
    project_statuses_created = []
    colors.each_with_index do |color, index|
      status = {"name"=>"#{names[index]} - #{names[index+1]}", "color"=>"#{color}", "status_type"=>"Asignable", "timer"=>"No", "project_type_id"=>"#{project_type_id}"}
      @project_status = ProjectStatus.new(status)
      if @project_status.save 
        new_status={}
        new_status["id"]=@project_status.id
        new_status["name"]=@project_status.name 
        project_statuses_created.push(new_status)
      end
    end
  render json: {"data": project_statuses_created}
  end


  # Busca los estados luego de seleccionar el proyecto
  def options
    @project_statuses = ProjectStatus.where(project_type_id: params[:project_type_id])
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_project_status
    @project_status = ProjectStatus.find(params[:id])
  end

  def load_project_types
    @project_type = ProjectType.find(params[:project_type_id])
  end
  # Never trust parameters from the scary internet, only allow the white list through.
  def project_status_params
    params.require(:project_status).permit(:name, :color, :status_type, :priority, :timer, :inherit_project_type_id, :inherit_status_id)
  end
end
