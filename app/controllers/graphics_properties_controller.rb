class GraphicsPropertiesController < ApplicationController
  before_action :set_graphics_property, only: [:show, :edit, :update, :destroy]

  # GET /graphics_properties
  # GET /graphics_properties.json
  def index
    @graphics_properties = GraphicsProperty.all
  end

  # GET /graphics_properties/1
  # GET /graphics_properties/1.json
  def show
  end

  # GET /graphics_properties/new
  def new
    @graphics_property = GraphicsProperty.new
  end

  # GET /graphics_properties/1/edit
  def edit
  end

  # POST /graphics_properties
  # POST /graphics_properties.json
  def create
    @graphics_property = GraphicsProperty.new(graphics_property_params)

    respond_to do |format|
      if @graphics_property.save
        format.html { redirect_to @graphics_property, notice: 'Graphics property was successfully created.' }
        format.json { render :show, status: :created, location: @graphics_property }
      else
        format.html { render :new }
        format.json { render json: @graphics_property.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /graphics_properties/1
  # PATCH/PUT /graphics_properties/1.json
  def update
    respond_to do |format|
      if @graphics_property.update(graphics_property_params)
        format.html { redirect_to @graphics_property, notice: 'Graphics property was successfully updated.' }
        format.json { render :show, status: :ok, location: @graphics_property }
      else
        format.html { render :edit }
        format.json { render json: @graphics_property.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /graphics_properties/1
  # DELETE /graphics_properties/1.json
  def destroy
    @graphics_property.destroy
    respond_to do |format|
      format.html { redirect_to graphics_properties_url, notice: 'Graphics property was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_graphics_property
      @graphics_property = GraphicsProperty.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def graphics_property_params
      params.require(:graphics_property).permit(:color, :height, :width, :title, :chart_id, :value)
    end
end
