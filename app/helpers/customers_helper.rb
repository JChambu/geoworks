module CustomersHelper

  def maps_for_select
    Customer::MAPS.map { |supplier_map| [t("maps.#{supplier_map.downcase}"), supplier_map]}
  end

end
