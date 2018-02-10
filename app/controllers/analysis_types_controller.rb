class AnalysisTypesController < ApplicationController
  before_action :set_analysis_type, only: [:show, :edit, :update, :destroy]

  # GET /analysis_types
  # GET /analysis_types.json
  def index
    @analysis_types = AnalysisType.all
  end

  # GET /analysis_types/1
  # GET /analysis_types/1.json
  def show
  end

  # GET /analysis_types/new
  def new
    @analysis_type = AnalysisType.new
  end

  # GET /analysis_types/1/edit
  def edit
  end

  # POST /analysis_types
  # POST /analysis_types.json
  def create
    @analysis_type = AnalysisType.new(analysis_type_params)

    respond_to do |format|
      if @analysis_type.save
        format.html { redirect_to @analysis_type, notice: 'Analysis type was successfully created.' }
        format.json { render :show, status: :created, location: @analysis_type }
      else
        format.html { render :new }
        format.json { render json: @analysis_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /analysis_types/1
  # PATCH/PUT /analysis_types/1.json
  def update
    respond_to do |format|
      if @analysis_type.update(analysis_type_params)
        format.html { redirect_to @analysis_type, notice: 'Analysis type was successfully updated.' }
        format.json { render :show, status: :ok, location: @analysis_type }
      else
        format.html { render :edit }
        format.json { render json: @analysis_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /analysis_types/1
  # DELETE /analysis_types/1.json
  def destroy
    @analysis_type.destroy
    respond_to do |format|
      format.html { redirect_to analysis_types_url, notice: 'Analysis type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_analysis_type
      @analysis_type = AnalysisType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def analysis_type_params
      params.require(:analysis_type).permit(:name, :description)
    end
end
