class PoiTypesController < ApplicationController
  before_filter :new_poi_type, :only => [:create]
  load_and_authorize_resource :only => [:create, :update, :index]
  before_action :set_poi_type, only: [:show, :edit, :update, :destroy, :sub_types, :chains, :food_types]

  # GET /poi_types
  # GET /poi_types.json
  def index
    @poi_types = PoiType.sorted_by_name.paginate(:page => params[:page])
  end

  def sub_types
    authorize! :visualize, :poi_type_sub_types
    render json: @poi_type.poi_sub_types
  end

  def chains
    authorize! :visualize, :poi_type_chains
    render json: @poi_type.chains
  end

  def food_types
    authorize! :visualize, :poi_type_food_types
    render json: @poi_type.food_types
  end

  # GET /poi_types/1
  # GET /poi_types/1.json
  def show
  end

  # GET /poi_types/new
  def new
  
  @poi_type = PoiType.new
  end

  # GET /poi_types/1/edit
  def edit
  end

  # POST /poi_types
  # POST /poi_types.json
  def create
    respond_to do |format|
      if @poi_type.save
        format.html { redirect_to @poi_type, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @poi_type }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @poi_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poi_types/1
  # PATCH/PUT /poi_types/1.json
  def update
    respond_to do |format|
      if @poi_type.update(poi_type_params)
        format.html { redirect_to @poi_type, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail
        format.html { render action: 'edit' }
        format.json { render json: @poi_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poi_types/1
  # DELETE /poi_types/1.json
  def destroy
    if @poi_type.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @poi_type
    end
    respond_to do |format|
      format.html { redirect_to poi_types_url }
      format.json { head :no_content }
    end
  end

  private
    def set_poi_type
      @poi_type = PoiType.find(params[:id])
    end

    def new_poi_type
      @poi_type = PoiType.new(poi_type_params)
    end

    def poi_type_params
      params.require(:poi_type).permit(:name)
    end
end
