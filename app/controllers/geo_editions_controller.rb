class GeoEditionsController < ApplicationController

  #  before_action :get_id, only:[:edit]
  before_action :set_geo_edition, only: [:show, :edit, :update, :destroy]
  before_action :count_rows


  def search_blocks
    @code = params[:id].split('-')
    @block = Block.where(div1: @code[0], manzana: @code[1]).select(:geom)
    @block.each {|n|
      @block_coordinate =[ n.geom.x , n.geom.y]
    }
    render json: @block_coordinate

  end



  # GET /geo_editions
  # GET /geo_editions.json

  def geoeditions_edit

    @geo_edition = GeoEdition.where(user_id: current_user.id).where.not(the_geom_segment_original: nil ).order(:updated_at).last
    @geo_edition = GeoEdition.last if @geo_edition.nil?

    @segment = @geo_edition.the_geom_segment_original
    if !@segment.nil?
      @num_point_segment = (@segment.num_points - 1 )
      (0..@num_point_segment).each {|n|
        p @segment.point_n(n).y 
        p @segment.point_n(n).x 
      }
    end
  end


  def index
    #@geo_editions = GeoEdition.all.paginate(page: params[:page]).order(:id)
    #@geo_editions = GeoEdition.where(user_id: current_user.id, poi_status_id: 8)
    search_params = {
      user_id_eq: current_user.id,
      poi_status_id_eq: 8
    }

    @search = GeoEdition.search(search_params)
    @geo_editions = @search.result

    respond_to do |format|  ## Add this
      format.json { render json: @geo_editions, status: :ok}
      format.html 
      ## Other format
    end  
  end

  # GET /geo_editions/1
  # GET /geo_editions/1.json
  def show

  end

  # GET /geo_editions/new
  def new
    @geo_edition = GeoEdition.new
    @geo_edition_last = GeoEdition.where(user_id:current_user.id).order(:updated_at).last
    @segment = @geo_edition_last.the_geom_segment_original
    @segment = @geo_edition_last.the_geom_segment if @segment.nil?
    @count = GeoEdition.where(user_id: current_user.id)

    if !@segment.nil?
      @num_point_segment = (@segment.num_points - 1 )
      (0..@num_point_segment).each {|n|
        p @segment.point_n(n).y 
        p @segment.point_n(n).x 

      }
    end
  end

  # GET /geo_editions/1/edit
  def edit

    @segment = @geo_edition.the_geom_segment_original 
    @segment = @geo_edition.the_geom_segment if @segment.blank? 
    @count = GeoEdition.where(user_id: current_user.id)

    if !@segment.nil? and  @segment.num_points > 0
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
    @segment = params[:geo_edition][:line]
    @segment = @segment.to_s
    respond_to do |format|
      if @geo_edition.save
        format.html { redirect_to edit_geo_edition_path(@geo_edition.id), flashman.update_success  }
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

    @geo_edition = GeoEdition.find(params[:geo_edition][:id])

    @segment = @geo_edition.the_geom_segment_original
    if !@segment.nil?
      @num_point_segment = (@segment.num_points - 1 )
      (0..@num_point_segment).each {|n|
        p @segment.point_n(n).y 
        p @segment.point_n(n).x 
      }
    end

    respond_to do |format|

      if @geo_edition.update(geo_edition_params)
        format.json { render json: @geo_edition }
        format.html { redirect_to edit_geo_edition_path(@geo_edition.id), flashman.update_success  }

      else
        format.json { render json: @geo_edition.errors, status: :unprocessable_entity }
        format.html { render :edit }

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

  def get_id

    @geo_edition = GeoEdition.where(user_id: current_user.id).where.not(the_geom_segment_original: nil, company: nil).order(:updated_at).last if params[:id].nil?
    @geo_edition = GeoEdition.last if @geo_edition.nil?
    params[:id] = @geo_edition

  end


  def set_geo_edition
    @geo_edition = GeoEdition.find(params[:id])
  end

  def count_rows
    @count = GeoEdition.where(user_id: current_user.id)
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def geo_edition_params
    params.require(:geo_edition).permit(:name, :the_geom_segment, :line, :id, :code, :number_door_start_original, :number_door_end_original, :gw_pta_ini, :gw_pta_fin, :poi_status_id, :gw_paridad, :gw_div1, :gw_div2, :gw_geomainid, :gw_street, :gw_code, :observations, :gw_calleid, :company, :yard, :wasteland).merge(user_id: current_user.id)
  end
end
