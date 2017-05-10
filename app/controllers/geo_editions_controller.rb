class GeoEditionsController < ApplicationController
  before_action :set_geo_edition, only: [:show, :edit, :update, :destroy]

  # GET /geo_editions
  # GET /geo_editions.json

  def geoeditions_edit
    
  end
  
  
  def index
    @geo_editions = GeoEdition.all.paginate(page: params[:page]).order(:street)
  end

  # GET /geo_editions/1
  # GET /geo_editions/1.json
  def show
  end

  # GET /geo_editions/new
  def new
    @geo_edition = GeoEdition.new
  end

  # GET /geo_editions/1/edit
  def edit

    @segment = @geo_edition.the_geom_segment_original
    if !@segment.nil?
      @num_point_segment = (@segment.num_points - 1 )
 (0..@num_point_segment).each {|n|
 p @segment.point_n(n).y 
 p @segment.point_n(n).x 
 }
  end
  end

  # POST /geo_editions
  # POST /geo_editions.json
  def create
    @geo_edition = GeoEdition.new(geo_edition_params)

    respond_to do |format|
      if @geo_edition.save
        format.html { redirect_to @geo_edition, notice: 'Geo edition was successfully created.' }
        format.json { render :show, status: :created, location: @geo_edition }
      else
        format.html { render :new }
        format.json { render json: @geo_edition.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /geo_editions/1
  # PATCH/PUT /geo_editions/1.json
  def update

    
    respond_to do |format|
      if @geo_edition.update(geo_edition_params)
        format.html { redirect_to @geo_edition, notice: 'Geo edition was successfully updated.' }
        format.json { render :show, status: :ok, location: @geo_edition }
      else
        format.html { render :edit }
        format.json { render json: @geo_edition.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /geo_editions/1
  # DELETE /geo_editions/1.json
  def destroy
    @geo_edition.destroy
    respond_to do |format|
      format.html { redirect_to geo_editions_url, notice: 'Geo edition was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_geo_edition
      @geo_edition = GeoEdition.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def geo_edition_params
      params.require(:geo_edition).permit(:name, :the_geom_segment, :line, :id)
    end
end
