class ParkingsController < ApplicationController
  before_action :set_parking, only: [:show, :edit, :update, :destroy]

  load_and_authorize_resource
  # GET /parkings
  # GET /parkings.json
  def index

    @search_ext = parkings_path 

    if current_user.role != 'Admin'
      params[:q] = {:user_id_eq => current_user.id}
    end

    @search = Parking.search(params[:q]) 
    @parkings = @search.result.paginate(page: params[:page])
  end

  # GET /parkings/1
  # GET /parkings/1.json
  def show
  end

  # GET /parkings/new
  def new
    @parking = Parking.new
  end

  # GET /parkings/1/edit
  def edit
  
    @p = @parking.the_geom_area
    @num_points = (@p.boundary.num_points - 1)

  end

  # POST /parkings
  # POST /parkings.json
  def create
    @parking = Parking.new(parking_params)

    respond_to do |format|
      if @parking.save
        format.html { redirect_to new_parking_url, notice: 'Parking was successfully created.' }
        format.json { render :show, status: :created, location: @parking }
      else
        format.html { render :new }
        format.json { render json: @parking.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /parkings/1
  # PATCH/PUT /parkings/1.json
  def update
    respond_to do |format|
      if @parking.update(parking_params)
        format.html { redirect_to @parking, notice: 'Parking was successfully updated.' }
        format.json { render :show, status: :ok, location: @parking }
      else
        format.html { render :edit }
        format.json { render json: @parking.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /parkings/1
  # DELETE /parkings/1.json
  def destroy
    @parking.destroy
    respond_to do |format|
      format.html { redirect_to parkings_url, notice: 'Parking was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def possible_duplicates

    @parkings = Parking.find_possible_duplicates(params[:parking])
    respond_to do |format|
      format.js
    end
  end
  private
  # Use callbacks to share common setup or constraints between actions.
  def set_parking
    @parking = Parking.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def parking_params
    params.require(:parking).permit(:name, :street, :brand, :operator, :facility_type_id, :levels, :city_id, :the_geom, :the_geom_entrance, :the_geom_exit, :phone, :website, :detailed_pricing_model, :price, :currency, :available_payment_methods, :regular_openning_hours, :exceptions_opening, :flag, :the_geom_area, :latitude, :longitude, :latitude_entry, :longitude_entry, :latitude_exit, :longitude_exit, :polygon, :number, :max_drive_height,:max_drive_width, :elevators,:escalators, :handicapped_accessible, :handicapped_parking_spaces, :women_parking_spaces, :sanitation_facilities, :restroom_available, :secure_parking, :security_manned, :electric_vehicle_charging_points, :connector_type, :number_of_connectors, :charge_point_operator, :payment_methods, :light, :motorcycle_parking_spaces, :family_friendly,:carwash, :parking_disc,  :parking_ticket, :gate, :monitored, :none, :total_space, :space_available, :available, :trend, :total_disabled_space, :available_disabled_space, :the_geom_area_original, :p_action_id, :poi_status_id, :line, :restrinctions, :machine_readable, :maximum_duration, :tow_away_zone, :street_sweeping, :street_mall_time_market, :pedestrian_zone_time, :snow_route, :clearway, :residential, :handicapped, :diplomatic, :media_press, :other, :loading_unloading_zone, :drop_pick_up_zona, :disabled_handicap_only, :private_parking, :commercial_vehicles_only, :side_street, :parking_capacity, :payment, :max_duration_parking_disc, :parking_configuration).merge(user_id: current_user.id) 
  end
end
