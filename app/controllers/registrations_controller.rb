class RegistrationsController < Devise::RegistrationsController

  private

  def sign_up_params
    user_rol = Role.find_by(name: 'Público')&.id
    user_project = ProjectType.find_by(name: 'Demo Público')&.id

    params.require(:user)
      .permit(:email, :name, :password, :password_confirmation, :country_code, :area_code, :phone)
      .merge(
        active: true,
        user_customers_attributes: [role_id: user_rol],
        has_project_types_attributes: [project_type_id: user_project],
        project_filters_attributes:[project_type_id: user_project, owner: true]
      )
  end
end
