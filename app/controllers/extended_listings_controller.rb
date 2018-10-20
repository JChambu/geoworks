class ExtendedListingsController < ApplicationController
  before_action :set_extended_listing, only: [:show, :edit, :update, :destroy]
  before_action :prepare_search_values, only: [:index ]

  # GET /extended_listings
  # GET /extended_listings.json

  def total_extendeds
    @extends = ExtendedListing.all
  end

  def georeferenced
    if current_user.name == 'Admin'
      @extended = ExtendedListing.build_geom
    end
  end


  def congrated_points
    @congrated = ExtendedListing.congrated_point
  end



  def possible_duplicates
#    authorize! :visualize, :possible_duplicates
    @extended = ExtendedListing.find_possible_duplicates(params[:extended_listing])
    respond_to do |format|
      format.js
    end
  end
  
  def duplicated

        @a = ExtendedListing.duplicated
=begin    @extended = ExtendedListing.all
    @a = []
    add = []
    @extended.map do |e|
      row = ExtendedListing.duplicated(e.name)

      if row.count > 1 

        row.map do |r|
        add = add.push([r.id,  r.name,  r.street])
        end
      end
       @a =  add.uniq! 
=end    end
  end

  def index
    @search_ext = extended_listings_path

    if params.has_key? :q
      params[:q][:created_at_gteq]= params[:q][:created_at_gteq].to_date.beginning_of_day if !params[:q][:created_at_gteq].blank?
      params[:q][:created_at_lteq]= params[:q][:created_at_lteq].to_date.end_of_day if !params[:q][:created_at_lteq].blank?
    end
    if current_user.role != 'Admin'
    params[:q][:user_id_eq] = current_user.id
    end
    @search = ExtendedListing.search(params[:q])
    @extended_listings = @search.result.paginate(:page => params[:page])
  
  end

  # GET /extended_listings/1
  # GET /extended_listings/1.json
  def show
  end

  # GET /extended_listings/new
  def new
    @extended_listing = ExtendedListing.new
    @extended_listing.city_id = params[:city_id] if !params[:city_id].nil?
    @extended_listing.poi_type_id = params[:poi_type_id] if !params[:poi_type_id].nil?
    @extended_listing.poi_sub_type_id = params[:poi_sub_type_id] if !params[:poi_sub_type_id].nil?


    #@extended_listing.category_id = params[:category_id] if !params[:category_id].nil?
  end

  # GET /extended_listings/1/edit
  def edit
  end

  # POST /extended_listings
  # POST /extended_listings.json
  def create

    params[:extended_listing].merge!(user_id: current_user.id)
    @extended_listing = ExtendedListing.new(extended_listing_params)



    #category =  Category.where(id: extended_listing_params[:category_id]).select(:category_original).first
    #@extended_listing[:category_original_id] = category.category_original.to_i
    respond_to do |format|
      if @extended_listing.save
        
        format.html { redirect_to new_extended_listing_path(extended_listing_params), notice: 'Extended listing was successfully created.' }
        format.json { render action: 'show', status: :created, location: @extended_listing }
      else
        format.html { render action: 'new' }
        format.json { render json: @extended_listing.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /extended_listings/1
  # PATCH/PUT /extended_listings/1.json
  def update
    #category =  Category.where(id: extended_listing_params[:category_id]).select(:category_original).first
    #@extended_listing[:category_original_id] = category.category_original.to_i
    respond_to do |format|
      if @extended_listing.update(extended_listing_params)
        format.html { redirect_to @extended_listing, notice: 'Extended listing was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @extended_listing.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /extended_listings/1
  # DELETE /extended_listings/1.json
  def destroy
    @extended_listing.destroy
    respond_to do |format|
      format.html { redirect_to extended_listings_url }
      format.json { head :no_content }
      format.js
    end
  end

  private

  def prepare_search_values
    if params.has_key? :q
      @from_date = params[:q][:control_date_gteq]
      @to_date = params[:q][:control_date_lteq]
      return
    end
    #params[:q] = {user_id: current_user.id} 
  end


  # Use callbacks to share common setup or constraints between actions.
  def set_extended_listing
    @extended_listing = ExtendedListing.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def extended_listing_params
    params.require(:extended_listing).permit(:name, :street, :the_geom, :city_id,  :category_id, :phone, :source, :address, :number, :address, :number, :poi_status_id, :category_original_id, :latitude, :longitude, :poi_type_id, :poi_sub_type_id, :website, :email, :user_id, :phone_2, :street_2, :street_3)
  end
end
