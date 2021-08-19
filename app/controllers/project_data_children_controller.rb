class ProjectDataChildrenController < ApplicationController
  before_action :set_project, only: [:index]
  before_action :set_project_data_child, only: [:show, :edit, :update, :destroy]


  # GET /project_data_children
  # GET /project_data_children.json
  def index
      @project_data_children = @project.project_data_child.where(project_id:params[:project_id])
      @sub_fields = ProjectSubfield.where(project_field_id: params[:project_field_id]).order(:id)
      @title = ProjectField.find(params[:project_field_id])
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

  def show_children

    project_ids = params[:project_ids]
    project_field_ids = params[:project_field_ids]

    data = ProjectDataChild
      .select(:id, :properties, :project_id, :project_field_id, :gwm_created_at)
      .where(:project_id => project_ids)
      .where(:project_field_id => project_field_ids)
      .where(row_active: true)
      .where(current_season: true)

    grouped_data = data.group_by { |c| c.project_id}

    render json: grouped_data

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
    def set_project
      @project = Project.find(params[:project_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_project_data_child
      @project_data_child = ProjectDataChild.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_data_child_params
      params.require(:project_data_child).permit(:properties, :project_id, :project_field_id)
    end
end
