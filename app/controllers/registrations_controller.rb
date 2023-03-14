class RegistrationsController < Devise::RegistrationsController

  private

  def sign_up_params
    new_user = User.last.id
    user_rol = Role.where(name: 'Público').pluck(:id).join(' ')
    user_project = ProjectType.where(name: 'Demo Público').pluck(:id).join(' ')

    params.require(:user).permit(:email, :name, :password, :password_confirmation, :country_code, :area_code, :phone)
          .reverse_merge(user_customers_attributes: [user_id: new_user, customer_id: current_tenant.id, role_id: user_rol],
                         has_project_types_attributes: [project_type_id: user_project, user_id: new_user],
                         project_filters_attributes:[user_id: new_user, project_type_id: user_project, owner: true],
                         active: true
                        )
  end
end
