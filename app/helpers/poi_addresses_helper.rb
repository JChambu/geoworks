module PoiAddressesHelper

  def set_poi_user
    @poi.user_id = current_user.id unless @poi.user_id
  end

end
