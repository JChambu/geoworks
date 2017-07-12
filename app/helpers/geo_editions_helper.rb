module GeoEditionsHelper

  def geo_edition_companies_select
    GeoEdition.select(:company).distinct.map { |company| company.company }
  end

end
