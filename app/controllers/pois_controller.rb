class PoisController < ApplicationController
  before_filter :new_poi, :only => [:create]
  load_and_authorize_resource
  before_action :set_poi, only: [:show, :edit, :update, :destroy]
  before_action :prepare_search_values, only: [:index ]
  before_action :check_control_dates_param_existance, only: [:deliver]

  # GET /pois
  # GET /pois.json

  def check
    @checkover = Poi.where(p_action_id:  '7', user_id: current_user.id)
    @pois = @checkover.paginate(:page => params[:page]) 
  end

  def around
    #render json: Poi.round(params[:name])
    render json: Poi.pois_around(params[:latitude], params[:longitude], params[:poi_type_id])
  end

  def total_poi_validates
    render json: Poi.total_validates()
  end

  def index

    @search_url = pois_path
    search_params = {
      :active_eq => true,
      :verification_eq => false,
      :control_date_gteq => Time.now.monday.strftime("%d %b %Y"),
      :control_date_lteq => Time.now.strftime("%d %b %Y")
    }

    @validated_url = pois_path({:q => search_params.merge({:poi_status_id_eq => PoiStatus.name_status('validated').id})})
    @delivered_url = pois_path({:q => search_params.merge({:poi_status_id_eq => PoiStatus.name_status('delivered').id})})

    @search = Poi.search(params[:q])
    @search.sorts = 'last_update'
    @pois = @search.result.paginate(:page => params[:page])
  end

  # GET /pois/1
  # GET /pois/1.json
  def show
  end

  # GET /pois/new
  def new

  end

  # GET /pois/1/edit
  def edit
  end

  def search
    authorize! :search, :pois
    pois = Poi.name_like params[:term], 15
    render :json => pois.map {|poi| { :name => poi.complete_name, :id => poi.id} }
  end

  def possible_duplicates
    authorize! :visualize, :possible_duplicates
    @pois = Poi.find_possible_duplicates(params[:poi])

    respond_to do |format|
      format.js
    end
  end

  def duplicated
    authorize! :visualize, :duplicated
    require 'will_paginate/array'
    @pois = Poi.duplicated_pois.paginate(:page => params[:page])

  end

  def deliver
    authorize! :deliver, :pois
    begin
      if @control_date_exist

        search = Poi.search(params[:q])
        delivered_count = Poi.deliver(search.result(:distinct => true))
        flashman.to_success(t("views.poi.index.messages.deliver_success", :count => delivered_count))
      else
        flashman.to_info(t("views.poi.index.messages.control_date_range_doesnt_exist"))
      end
    rescue
      flashman.to_error(t("views.poi.index.messages.deliver_error"))
    end

    redirect_to pois_url({q: params[:q]})
  end

  def download
    authorize! :download, :pois
    begin
      search = Poi.search(params[:dq])
      pois = search.result(:distinct => true)
      limit = 25000
      if pois.count <= limit
        file_path = Poi.download(pois, {:prefix => params[:download][:prefix]})        
        send_file file_path, :type => "application/excel"
        #TODO: eliminar el archivo despues de la descarga
      else
        flashman.to_info(t("views.poi.index.messages.to_many_poist_for_download", :count => limit))
        redirect_to pois_url({q: params[:q]})
      end
    rescue
      flashman.to_error(t("views.poi.index.messages.download_error"))
      redirect_to pois_url({q: params[:q]})
    end    
  end

  def deliveries_pois 

    #search = Poi.search(params[:dq])
    #pois = search.result(:distinct => true)
    #file_path = Poi.deliveries(pois)         
    #redirect_to pois_url({q: params[:q]})
  end



  # POST /pois
  # POST /pois.json
  def create

    @poi[:user_id] =  current_user.id
    @poi[:control_date] = Date.current
    @poi[:poi_status_id] = 2
    @poi[:active] = true
    @poi[:p_action_id] = 1
    @poi[:poi_source_id] = 2


    respond_to do |format|
      if @poi.save
        flashman.create_success
        format.html { redirect_to new_poi_url }
        format.json { render action: 'show', status: :created, location: @poi }
      else
        flashman.create_fail @poi
        format.html { render action: 'new' }
        format.json { render json: @poi.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /pois/1
  # PATCH/PUT /pois/1.json
  def update
    # Hardcodeamos el action, por alguna razon no lo hace solo
    #@poi.p_action_id = params[:poi][:p_action_id];


    params[:poi][:user_id] =  current_user.id if params[:poi][:user_id].nil?
    params[:poi][:control_date] = Date.current if params[:poi][:control_date].empty?
    params[:poi][:poi_status_id] = 2 if params[:poi][:poi_status_id].to_i == PoiStatus.not_validated.id 
    params[:poi][:poi_status_id] = 2 if params[:poi][:p_action_id].to_i == PAction.name_action("check").id

    @poi[:active] = true
    respond_to do |format|


      if @poi.update(poi_params)
        format.html { redirect_to pois_url, flashman.update_success }
        format.json { render json: @poi }
      else
        flashman.update_fail @poi
        format.html { render action: 'edit' }
        format.json { render json: @poi.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /pois/1
  # DELETE /pois/1.json
  def destroy

    authorize! :destroy, :pois
    # logger.debug @user_id


    if @poi.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail
    end
    respond_to do |format|

      if params[:controller_back].nil? 
        format.html { redirect_to pois_url }
        format.json { head :no_content }
      else
        format.html { redirect_to reports_poi_verification_path(country_id: params[:country_id], poi_type_id: params[:poi_type_id], chain_id: params[:chain_id])}
        format.json { head :no_content }
      end
    end
  end

  def delete_multiple

    authorize! :destroy, :pois
    Poi.where(id: params[:poi_ids]).destroy_all
    redirect_to duplicated_pois_path 
  end
  private
  def check_control_dates_param_existance 
    @control_date_exist = false

    if params.has_key? :q and
      params[:q].has_key? :control_date_gteq and
      params[:q].has_key? :control_date_lteq and
      !params[:q][:control_date_gteq].nil? and
      !params[:q][:control_date_lteq].nil? and
      !params[:q][:control_date_gteq].empty? and
      !params[:q][:control_date_lteq].empty?

      @control_date_exist = true
    end
  end

  def prepare_search_values
    if params.has_key? :q
      @poi_type_id = params[:q][:poi_type_id_eq]
      @country_id = params[:q][:country_id_eq]
      @province_id = params[:q][:province_id_eq]
      @department_id = params[:q][:department_id_eq]
      @from_date = params[:q][:control_date_gteq]
      @to_date = params[:q][:control_date_lteq]
      @poi_status_id = params[:q][:poi_status_id_eq]
      return
    end

    params[:q] = {:active_eq => true}
  end

  def set_poi
    @poi = Poi.find(params[:id])
  end

  def new_poi
    @poi = Poi.new(poi_params)
  end

  def poi_params
    params.require(:poi).permit(
      :name,
      :latitude,
      :longitude,
      :short_name,
      :website,
      :email,
      :second_email,
      :note,
      :cel_number,
      :phone,
      :second_phone,
      :fax,
      :house_number,
      :contact,
      :priority,
      :location,
      :city_id,
      :chain_id,
      :food_type_id,
      :poi_source_id,
      :poi_type_id,
      :poi_sub_type_id,
      :street_name,
      :street_type_id,
      :user_id,
      :poi_status_id,
      :the_geom,
      :active,
      :deleted,
      :identifier,
      :control_date,
      :old_identifier,
      :duplicated_identifier,
      :p_action_id,
      :verification,
      :internal_observation,
      :restaurant_type_id
    )
  end
end
