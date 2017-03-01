class PoiSourcesController < ApplicationController
  load_and_authorize_resource
  before_action :set_poi_source, only: [:show, :edit, :update, :destroy]

  # GET /poi_sources
  # GET /poi_sources.json
  def index
    @poi_sources = PoiSource.paginate(:page => params[:page])
  end

  # GET /poi_sources/1
  # GET /poi_sources/1.json
  def show
  end

  # GET /poi_sources/new
  def new
    @poi_source = PoiSource.new
  end

  # GET /poi_sources/1/edit
  def edit
  end

  # POST /poi_sources
  # POST /poi_sources.json
  def create
    @poi_source = PoiSource.new(poi_source_params)

    respond_to do |format|
      if @poi_source.save
        format.html { redirect_to @poi_source, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @poi_source }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @poi_source.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poi_sources/1
  # PATCH/PUT /poi_sources/1.json
  def update
    respond_to do |format|
      if @poi_source.update(poi_source_params)
        format.html { redirect_to @poi_source, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail
        format.html { render action: 'edit' }
        format.json { render json: @poi_source.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poi_sources/1
  # DELETE /poi_sources/1.json
  def destroy
    if @poi_source.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @poi_source
    end    

    respond_to do |format|
      format.html { redirect_to poi_sources_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_poi_source
      @poi_source = PoiSource.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def poi_source_params
      params.require(:poi_source).permit(:name)
    end
end
