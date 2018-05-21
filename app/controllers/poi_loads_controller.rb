class PoiLoadsController < ApplicationController
  #before_filter :new_poi_load, :only => [:create]
  load_and_authorize_resource
  before_action :set_poi_load, only: [:show, :destroy, :download_source_file, :download_errors_file]

  # GET /poi_loads
  # GET /poi_loads.json
  def index
    @poi_loads = PoiLoad.ordered_by_load_date
  end

  # GET /poi_loads/1
  # GET /poi_loads/1.json
  def show
  end

  # GET /poi_loads/new
  def new
  end

  def download_source_file
    begin
      send_file @poi_load.source_path, :type => "application/excel"
    rescue
      render :text => "error"
    end
  end

  def download_xls_example
    send_file "#{Rails.public_path.to_s}/poi/example.xls", :type => "application/excel"
  end

  def download_errors_file
    begin
      send_file @poi_load.errors_path, :type => "text"
    rescue
      render :text => "error"
    end    
  end

  # POST /poi_loads
  # POST /poi_loads.json
  def create
    respond_to do |format|
      if @poi_load.save
        format.html { redirect_to poi_loads_url, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @poi_load }
      else
        flashman.create_fail @poi_load
        format.html { render action: 'new' }
        format.json { render json: @poi_load.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poi_loads/1
  # DELETE /poi_loads/1.json
  def destroy
    if @poi_load.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @poi_load
    end

    respond_to do |format|
      format.html { redirect_to poi_loads_url }
      format.json { head :no_content }
    end
  end

  private
    def set_poi_load
      @poi_load = PoiLoad.find(params[:id])
    end

    def new_poi_load
      @poi_load = PoiLoad.new(poi_load_params)
    end

    def poi_load_params
      params.require(:poi_load).permit(:name, :load_date, :status, :file)
    end
end
