module GeoEditionsHelper

  def geo_edition_companies_select
    GeoEdition.select(:company).distinct.map { |company| company.company }
  end

  def geo_edition_street_id_select(company)
    Street.where(city_name: company).map {|street|[ street.name, street.id]} 
  end



  def last_id
    @geo_edition = GeoEdition.where(user_id: current_user.id).where.not(the_geom_segment_original: nil, company: nil).order(:updated_at).last if params[:id].nil?
    @geo_edition = GeoEdition.last if @geo_edition.nil?
    geo_edition_id = @geo_edition.id
    return geo_edition_id


  
  end



end
