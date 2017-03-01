class PoiAddressesController < ApplicationController
  
#  load_and_authorize_resource
  before_action :set_poi_address, only: [:show, :edit, :update, :destroy]


  def total_poi_validates
    render json: PoiAddress.total_validates()
  end
  
  def georeferenced
  end
  
  # GET /poi_addresses
  # GET /poi_addresses.json
  def index
    @poi_addresses = PoiAddress.all.paginate(page: params[:page]).order(:street)

  end

  # GET /poi_addresses/1
  # GET /poi_addresses/1.json
  def show
  end

  # GET /poi_addresses/new
  def new
    @poi_address = PoiAddress.new
    @poi_address.city_id = params[:city_id] if !params[:city_id].nil?
    @poi_address.street = params[:street] if !params[:street].nil?
    @poi_address.neighborhood = params[:neighborhood] if !params[:neighborhood].nil?
    @poi_address.block = params[:block] if !params[:block].nil?
    @poi_address.source= params[:source] if !params[:source].nil?
  
  end

  # GET /poi_addresses/1/edit
  def edit
  end

  # POST /poi_addresses
  # POST /poi_addresses.json
  def create
    @poi_address = PoiAddress.new(poi_address_params)
    respond_to do |format|
      if @poi_address.save

        format.html { redirect_to new_poi_address_path(poi_address_params), notice: 'Poi address was successfully created.' }
        format.json { render action: 'show', status: :created, location: @poi_address }
      else
        format.html { render action: 'new' }
        format.json { render json: @poi_address.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poi_addresses/1
  # PATCH/PUT /poi_addresses/1.json
  def update
    respond_to do |format|
      if @poi_address.update(poi_address_params)
        format.html { redirect_to @poi_address, notice: 'Poi address was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @poi_address.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poi_addresses/1
  # DELETE /poi_addresses/1.json
  def destroy
    @poi_address.destroy
    respond_to do |format|
      format.html { redirect_to poi_addresses_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_poi_address
      @poi_address = PoiAddress.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def poi_address_params
      params.require(:poi_address).permit(:city_id, :street, :number, :neighborhood, :block, :house, :user_id, :source, :latitude, :longitude, :p_action_id).merge(user_id: current_user.id)

    end
end
