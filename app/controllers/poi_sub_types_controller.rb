class PoiSubTypesController < ApplicationController
  #before_filter :new_poi_sub_type, :only => [:create]
  load_and_authorize_resource
  before_action :set_poi_sub_type, only: [:show, :edit, :update, :destroy]

  # GET /poi_sub_types
  # GET /poi_sub_types.json
  def index
    @poi_sub_types = PoiSubType.sorted_by_name.paginate(:page => params[:page])
    # comentario
  end

  # GET /poi_sub_types/1
  # GET /poi_sub_types/1.json
  def show
  end

  # GET /poi_sub_types/new
  def new
  end

  # GET /poi_sub_types/1/edit
  def edit
  end

  # POST /poi_sub_types
  # POST /poi_sub_types.json
  def create
    respond_to do |format|
      if @poi_sub_type.save
        format.html { redirect_to @poi_sub_type, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @poi_sub_type }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @poi_sub_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /poi_sub_types/1
  # PATCH/PUT /poi_sub_types/1.json
  def update
    respond_to do |format|
      if @poi_sub_type.update(poi_sub_type_params)
        format.html { redirect_to @poi_sub_type, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail
        format.html { render action: 'edit' }
        format.json { render json: @poi_sub_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /poi_sub_types/1
  # DELETE /poi_sub_types/1.json
  def destroy    
    if @poi_sub_type.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @poi_sub_type
    end    
    respond_to do |format|
      format.html { redirect_to poi_sub_types_url }
      format.json { head :no_content }
    end
  end

  private
    def set_poi_sub_type
      @poi_sub_type = PoiSubType.find(params[:id])
    end

    def new_poi_sub_type
      @poi_sub_type = PoiSubType.new(poi_sub_type_params)
    end

    def poi_sub_type_params
      params.require(:poi_sub_type).permit(:name, :poi_type_id)
    end
end
