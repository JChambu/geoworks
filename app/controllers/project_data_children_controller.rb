class ProjectDataChildrenController < ApplicationController
  before_action :set_project_data_child, only: [:show, :edit, :update, :destroy]

  # GET /project_data_children
  # GET /project_data_children.json
  def index
    @project_data_children = ProjectDataChild.all
  end

  # GET /project_data_children/1
  # GET /project_data_children/1.json
  def show
  end

  # GET /project_data_children/new
  def new
    @project_data_child = ProjectDataChild.new
  end

  # GET /project_data_children/1/edit
  def edit
  end

  # POST /project_data_children
  # POST /project_data_children.json
  def create
    @project_data_child = ProjectDataChild.new(project_data_child_params)

    respond_to do |format|
      if @project_data_child.save
        format.html { redirect_to @project_data_child, notice: 'Project data child was successfully created.' }
        format.json { render :show, status: :created, location: @project_data_child }
      else
        format.html { render :new }
        format.json { render json: @project_data_child.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_data_children/1
  # PATCH/PUT /project_data_children/1.json
  def update
    respond_to do |format|
      if @project_data_child.update(project_data_child_params)
        format.html { redirect_to @project_data_child, notice: 'Project data child was successfully updated.' }
        format.json { render :show, status: :ok, location: @project_data_child }
      else
        format.html { render :edit }
        format.json { render json: @project_data_child.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /project_data_children/1
  # DELETE /project_data_children/1.json
  def destroy
    @project_data_child.destroy
    respond_to do |format|
      format.html { redirect_to project_data_children_url, notice: 'Project data child was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_project_data_child
      @project_data_child = ProjectDataChild.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_data_child_params
      params.require(:project_data_child).permit(:properties, :project_id, :project_field_id)
    end
end
