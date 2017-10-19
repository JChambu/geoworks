class RegexpTypesController < ApplicationController
  before_action :set_regexp_type, only: [:show, :edit, :update, :destroy]

  # GET /regexp_types
  # GET /regexp_types.json
  def index
    @regexp_types = RegexpType.all
  end

  # GET /regexp_types/1
  # GET /regexp_types/1.json
  def show
  end

  # GET /regexp_types/new
  def new
    @regexp_type = RegexpType.new
  end

  # GET /regexp_types/1/edit
  def edit
  end

  # POST /regexp_types
  # POST /regexp_types.json
  def create
    @regexp_type = RegexpType.new(regexp_type_params)

    respond_to do |format|
      if @regexp_type.save
        format.html { redirect_to @regexp_type, notice: 'Regexp type was successfully created.' }
        format.json { render :show, status: :created, location: @regexp_type }
      else
        format.html { render :new }
        format.json { render json: @regexp_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /regexp_types/1
  # PATCH/PUT /regexp_types/1.json
  def update
    respond_to do |format|
      if @regexp_type.update(regexp_type_params)
        format.html { redirect_to @regexp_type, notice: 'Regexp type was successfully updated.' }
        format.json { render :show, status: :ok, location: @regexp_type }
      else
        format.html { render :edit }
        format.json { render json: @regexp_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /regexp_types/1
  # DELETE /regexp_types/1.json
  def destroy
    @regexp_type.destroy
    respond_to do |format|
      format.html { redirect_to regexp_types_url, notice: 'Regexp type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_regexp_type
      @regexp_type = RegexpType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def regexp_type_params
      params.require(:regexp_type).permit(:name, :expresion, :observations)
    end
end
