module RestaurantTypesHelper

  def poi_restaurant_types_for_select
    RestaurantType.sorted_by_name.map { |poi_restaurant| [poi_restaurant.name, poi_restaurant.id] }
  end
end
