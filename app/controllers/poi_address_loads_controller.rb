class PoiAddressLoadsController < ApplicationController
  before_action :set_poi_address_load, only: [:show, :edit, :update, :destroy]
#  load_and_authorize_resource
  # GET /poi_address_loads
  # GET /poi_address_loads.json
  def index
    @poi_address_loads = PoiAddressLoad.all.order(:id)
  end

  # GET /poi_address_loads/1
  # GET /poi_address_loads/1.json
  def show
  end

  # GET /poi_address_loads/new
  def new
    @poi_address_load = PoiAddressLoad.new
  end

  # GET /poi_address_loads/1/edit
  def edit
  end

  # POST /poi_address_loads
  # POST /poi_address_loads.json
  def create
    @poi_address_load = PoiAddressLoad.new(poi_address_load_params)

    respond_to do |format|
      if @poi_address_load.save
        format.html { redirect_to poi_address_loads_path, notice: 'Poi address load was successfully created.' }
        format.json { render action: 'show', status: :created, location: @poi_address_load }
      else
        format.html { render action: 'new' }
        format.json { render json: @poi_address_load.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poi_address_loads/1
  # PATCH/PUT /poi_address_loads/1.json
  def update
    respond_to do |format|
      if @poi_address_load.update(poi_address_load_params)
        format.html { redirect_to @poi_address_load, notice: 'Poi address load was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @poi_address_load.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poi_address_loads/1
  # DELETE /poi_address_loads/1.json
  def destroy
    @poi_address_load.destroy
    respond_to do |format|
      format.html { redirect_to poi_address_loads_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_poi_address_load
      @poi_address_load = PoiAddressLoad.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def poi_address_load_params
      params.require(:poi_address_load).permit(:name, :status, :directory_name, :file, :city_id, :color)
    end
end
