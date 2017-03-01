module PoiSubTypesHelper
  def poi_sub_types_for_select
    PoiSubType.sorted_by_name.map { |sub_type| [sub_type.name, sub_type.id] }
  end
end
