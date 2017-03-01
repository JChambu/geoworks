class ExtendedListingLoadsController < ApplicationController
  before_action :set_extended_listing_load, only: [:show, :edit, :update, :destroy]

  # GET /extended_listing_loads
  # GET /extended_listing_loads.json
  def index
    @extended_listing_loads = ExtendedListingLoad.all.order(:id)
  end

  # GET /extended_listing_loads/1
  # GET /extended_listing_loads/1.json
  def show
  end

  # GET /extended_listing_loads/new
  def new
    @extended_listing_load = ExtendedListingLoad.new
  end

  # GET /extended_listing_loads/1/edit
  def edit
  end

  # POST /extended_listing_loads
  # POST /extended_listing_loads.json
  def create
    @extended_listing_load = ExtendedListingLoad.new(extended_listing_load_params)

    respond_to do |format|
      if @extended_listing_load.save
        format.html { redirect_to extended_listing_loads_url, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @extended_listing_load }
      else
        format.html { render action: 'new' }
        format.json { render json: @extended_listing_load.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /extended_listing_loads/1
  # PATCH/PUT /extended_listing_loads/1.json
  def update
    respond_to do |format|
      if @extended_listing_load.update(extended_listing_load_params)
        format.html { redirect_to @extended_listing_load, notice: 'Extended listing load was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @extended_listing_load.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /extended_listing_loads/1
  # DELETE /extended_listing_loads/1.json
  def destroy
    @extended_listing_load.destroy
    respond_to do |format|
      format.html { redirect_to extended_listing_loads_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_extended_listing_load
      @extended_listing_load = ExtendedListingLoad.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def extended_listing_load_params
      params.require(:extended_listing_load).permit(:name, :status, :success_count, :fail_count, :already_loaded_count, :directory_name, :file)
    end
end
