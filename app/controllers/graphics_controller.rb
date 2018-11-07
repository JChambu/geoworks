class GraphicsController < ApplicationController
  before_action :set_dashboard
  before_action :set_graphic, only: [:show, :edit, :update, :destroy]

  # GET /graphics
  # GET /graphics.json
  def index
    @graphics = @dashboard.graphics.all
  end

  # GET /graphics/1
  # GET /graphics/1.json
  def show
  end

  # GET /graphics/new
  def new
    @graphic = @dashboard.graphics.new
    1.times {@graphic.graphics_properties.build}

    respond_to do |f|
      f.js
    end
  end

  # GET /graphics/1/edit
  def edit
    @graphic = @dashboard.graphics.find(params[:id])
    respond_to do |f|
      f.js
    end
  end

  # POST /graphics
  # POST /graphics.json
  def create
    @graphic = @dashboard.graphics.new(graphic_params)
    respond_to do |format|
      if @graphic.save
        format.js
        format.html { redirect_to project_type_dashboard_path(@project_type, @dashboard.id), notice: 'Graphic was successfully created.' }
        format.json { render :show, status: :created, location: @graphic }
      else
        format.html { render :new }
        format.json { render json: @graphic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /graphics/1
  # PATCH/PUT /graphics/1.json
  def update
    @graphic = @dashboard.graphics.find(params[:id])
    respond_to do |format|
      if @graphic.update(graphic_params)
        format.js
        format.html { redirect_to @graphic, notice: 'Graphic was successfully updated.' }
        format.json { render :show, status: :ok, location: @graphic }
      else
        format.html { render :edit }
        format.json { render json: @graphic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /graphics/1
  # DELETE /graphics/1.json
  def destroy
    @graphic.destroy
    respond_to do |format|
      format.html { redirect_to graphics_url, notice: 'Graphic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
  def set_dashboard
    @project_type = ProjectType.find(params[:project_type_id])
    @dashboard = Dashboard.find(params[:dashboard_id])
  end
  
  def set_graphic
      @graphic = Graphic.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def graphic_params
      params.require(:graphic).permit(:token, :dashboard_id, :title, :width, graphics_properties_attributes: [:id, :color, :chart_id, :analytics_dashboard_id, :graphic_id ])
    end
end
