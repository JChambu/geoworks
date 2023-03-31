class RegistrationsController < Devise::RegistrationsController

  private

  def sign_up_params
    rol_id          = Role.find_by(name: 'Público')&.id
    project_type_id = ProjectType.find_by(name: 'Demo Público')&.id
    current_tenant  = Apartment::Tenant.current
    customer_id     = Customer.find_by(subdomain: current_tenant)&.id

    params.require(:user)
      .permit(:email, :name, :password, :password_confirmation, :country_code, :area_code, :phone)
      .merge(
        active: true,
        user_customers_attributes: [customer_id: customer_id, role_id: rol_id],
        has_project_types_attributes: [project_type_id: project_type_id],
        project_filters_attributes:[project_type_id: project_type_id, owner: true]
      )
  end
end
