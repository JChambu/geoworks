module FoodTypesHelper
  def food_types_for_select
    FoodType.sorted_by_name.map { |food_type| [food_type.name, food_type.id] }
  end
end
