module CustomersHelper

  def maps_for_select
    Customer::MAPS.map { |supplier_map| [t("maps.#{supplier_map.downcase}"), supplier_map]}
  end

  def customers_for_select 
    Customer.all.map {|customer| [customer.name, customer.name] }
  end

end
