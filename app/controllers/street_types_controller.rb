class StreetTypesController < ApplicationController
  #before_filter :new_street_type, :only => [:create]
  load_and_authorize_resource
  before_action :set_street_type, only: [:show, :edit, :update, :destroy]

  # GET /street_types
  # GET /street_types.json
  def index
    @street_types = StreetType.sorted_by_name.paginate(:page => params[:page])
  end

  # GET /street_types/1
  # GET /street_types/1.json
  def show
  end

  # GET /street_types/new
  def new
  end

  # GET /street_types/1/edit
  def edit
  end

  # POST /street_types
  # POST /street_types.json
  def create
    respond_to do |format|
      if @street_type.save
        format.html { redirect_to @street_type, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @street_type }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @street_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /street_types/1
  # PATCH/PUT /street_types/1.json
  def update
    respond_to do |format|
      if @street_type.update(street_type_params)
        format.html { redirect_to @street_type, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail
        format.html { render action: 'edit' }
        format.json { render json: @street_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /street_types/1
  # DELETE /street_types/1.json
  def destroy
    if @street_type.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @street_type
    end

    respond_to do |format|
      format.html { redirect_to street_types_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_street_type
      @street_type = StreetType.find(params[:id])
    end

    def new_street_type
      @street_type = StreetType.new(street_type_params)
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def street_type_params
      params.require(:street_type).permit(:name)
    end
end
