class ReportsController < ApplicationController
  before_action :prepare_search_values, only: [:pois, :users]
 
  def pois
    authorize! :visualize, :pois_report
    @search_url = reports_pois_path
    rp = ReportsPresenter.new
    @country_totals = rp.poi_totals_by_country(@search.result(:distinct => true))
    @poi_type_totals = rp.poi_totals_by_poi_type(@search.result(:distinct => true))
  end

  def users
    authorize! :visualize, :users_report
    @search_url = reports_users_path
    rp = ReportsPresenter.new
    @totals = rp.user_totals_by_country(@search.result(:distinct => true))
    @totals_2 = rp.user_totals_by_users(@search.result(:distinct => true))
  end

  def poi_verification

    @verification = Poi.verification_pois(params) 
    @pois = @verification.paginate(:page => params[:page], per_page: 50)
  
    if params[:commit] == 'Revisado'
      verificated_multiple params[:poi_ids]
    end
  
  end

  def poi_verification_maps
  end

  def verificated_multiple poi_ids
    Poi.where(id: poi_ids).update_all(poi_status_id: 7 )
    @verification_poi = VerificationPoi.create_verification(current_user.id, params[:poi_ids])
  end

  def prepare_search_values
    if params.has_key? :q
      @poi_type_id = params[:q][:poi_type_id_eq]
      @country_id = params[:q][:country_id_eq]
      @province_id = params[:q][:province_id_eq]
      @department_id = params[:q][:department_id_eq]
    else
      params[:q] = {
        :active_eq => true,
        :control_date_gteq => Time.now.monday.strftime("%d %b %Y"),
        :control_date_lteq => Time.now.strftime("%d %b %Y"),
        :poi_status_id_eq => PoiStatus.name_status("delivered").id
      }
      @poi_status_id = params[:q][:poi_status_id_eq]
    end

    @from_date = params[:q][:control_date_gteq]
    @to_date = params[:q][:control_date_lteq]    
    @search = Poi.search(params[:q])    
  end

  def  update
    @poi = Poi.update_revised(current_user.id)
    #@poi.update_columns(verification: true, poi_status_id: 4)
    redirect_to reports_poi_verification_path(country_id: params[:country_id], poi_type_id: params[:poi_type_id], user_id: params[:user_id], chain_id: params[:chain_id])
  end
end
