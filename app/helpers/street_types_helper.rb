module StreetTypesHelper
  def street_types_for_select
    StreetType.sorted_by_name.map { |street_type| [street_type.name, street_type.id] }
  end	
end
