module CustomersHelper

  def maps_for_select
    Customer::MAPS.map { |supplier_map| [t("maps.#{supplier_map.downcase}"), supplier_map]}
  end

  def customers_for_select
    Customer.all.map {|customer| [customer.name, customer.id] }
  end

  def roles_customers_for_select(customer_id)
    customer_name = Customer.where(id: customer_id).pluck(:subdomain).first
    Apartment::Tenant.switch customer_name do
      @roles = Role.all.map {|role| [role.name, role.id] }
    end
  end

  def current_tenement_helper
    @ct = Apartment::Tenant.current
    if @ct == 'public'
      @ct = 'geoworks'
    end
    @ct
  end
end
