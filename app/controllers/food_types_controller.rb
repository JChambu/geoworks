class FoodTypesController < ApplicationController
  before_filter :new_food_type, :only => [:create]
  load_and_authorize_resource
  before_action :set_food_type, only: [:show, :edit, :update, :destroy]

  # GET /food_types
  # GET /food_types.json
  def index
    @food_types = FoodType.sorted_by_name.paginate(:page => params[:page])
  end

  # GET /food_types/1
  # GET /food_types/1.json
  def show
  end

  # GET /food_types/new
  def new
  end

  # GET /food_types/1/edit
  def edit
  end

  # POST /food_types
  # POST /food_types.json
  def create
    respond_to do |format|
      if @food_type.save
        format.html { redirect_to @food_type, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @food_type }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @food_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /food_types/1
  # PATCH/PUT /food_types/1.json
  def update
    respond_to do |format|
      if @food_type.update(food_type_params)
        format.html { redirect_to @food_type, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail
        format.html { render action: 'edit' }
        format.json { render json: @food_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /food_types/1
  # DELETE /food_types/1.json
  def destroy
    if @food_type.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @food_type
    end

    respond_to do |format|
      format.html { redirect_to food_types_url }
      format.json { head :no_content }
    end
  end

  private
    def set_food_type
      @food_type = FoodType.find(params[:id])
    end

    def new_food_type
      @food_type = FoodType.new(food_type_params)
    end

    def food_type_params
      params.require(:food_type).permit(:name, :poi_type_id)
    end
end
