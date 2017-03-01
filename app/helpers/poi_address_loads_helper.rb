module PoiAddressLoadsHelper

  def poi_address_load_status_label poi_address_load
    "<label class='#{poi_address_load.status.to_s}-status'>#{poi_address_load.status}</label>".html_safe
  end

end
