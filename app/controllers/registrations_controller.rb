class RegistrationsController < Devise::RegistrationsController

  def create
    build_resource(sign_up_params)

    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        set_flash_message! :notice, :signed_up
        sign_up(resource_name, resource)
        respond_with resource, location: after_sign_up_path_for(resource)
      else
        expire_data_after_sign_in!
        redirect_to new_user_session_path, notice: "¡Registro exitoso! Ve a tu email para confirmar tu cuenta."
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end
  end

  private

  def sign_up_params
    rol_id            = Role.find_by(name: 'Público')&.id
    project_types_ids = ProjectType.pluck(:id)
    project_type_id   = ProjectType.find_by(name: 'Demo Público')&.id
    current_tenant    = Apartment::Tenant.current
    customer_id       = Customer.find_by(subdomain: current_tenant)&.id

    params.require(:user)
      .permit(:email, :name, :password, :password_confirmation, :country_code, :area_code, :phone)
      .merge(
        active: true,
        user_customers_attributes: [customer_id: customer_id, role_id: rol_id],
        has_project_types_attributes: project_types_ids.map { |id| { project_type_id: id } },
        project_filters_attributes:[project_type_id: project_type_id, owner: true]
      )
  end
end