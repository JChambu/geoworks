class RegistrationsController < Devise::RegistrationsController

  private

  def sign_up_params
    user_rol = Role.find_by(name: 'Público')&.id
    user_project = ProjectType.find_by(name: 'Demo Público')&.id

    params.require(:user).permit(:email, :name, :password, :password_confirmation, :country_code, :area_code, :phone)
          .reverse_merge(user_customers_attributes: [customer_id: current_tenant.id, role_id: user_rol],
                         has_project_types_attributes: [project_type_id: user_project],
                         project_filters_attributes:[project_type_id: user_project, owner: true],
                         active: true
                        )
  end
end
