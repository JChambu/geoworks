module PoiTypesHelper
  def poi_types_for_select
    PoiType.sorted_by_name.map { |poi_type| [poi_type.name, poi_type.id] }
  end

  def poi_type_sub_types_for_select poi_type_id
    poi_type = PoiType.find_by_id poi_type_id
    return [] unless poi_type
    poi_type.poi_sub_types.map { |sub_type| [sub_type.name, sub_type.id] }
  end

  def poi_type_chains_for_select
    Chain.sorted_by_name.map { |chain| [ (label_chain chain) , chain.id] }
  end

  


  def poi_type_food_types_for_select poi_type_id
    poi_type = PoiType.find_by_id poi_type_id
    return [] unless poi_type
    poi_type.food_types.map { |food| [food.name, food.id] }
  end
end
