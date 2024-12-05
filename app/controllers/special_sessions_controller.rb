class SpecialSessionsController < ApplicationController
  skip_authorize_resource :only => [:special_user_session, :switch_multitenant, :geometry_shared]
  skip_before_action :authenticate_user!, :only => [:special_user_session, :switch_multitenant, :geometry_shared]

  def special_user_session
    special_user = User.find_by(email: 'public@geoworks.com')
    if special_user
      sign_in(special_user)
      redirect_to root_path
    else
      redirect_to new_user_session_path, alert: "Usuario Especial no encontrado."
    end
  end

  def geometry_shared
    special_user = User.find_by(email: 'super@admin.com')
    project_id = params[:project_id].to_i
    project_type_id = params[:project_type_id].to_i

    if !session[:project_type_id_shared].present?
      session[:project_type_id_shared] = project_type_id
      session[:project_id_shared] = project_id
    end

    sign_in(special_user)
    redirect_to root_path
  end

  def switch_multitenant
    tenant_name = params[:tenant]
    tenant_subdomain = Customer.where(name: tenant_name).pluck(:subdomain).first

    if tenant_subdomain.present?
      Apartment::Tenant.switch! tenant_subdomain
      session[:current_tenant] = tenant_subdomain
      sign_in(current_user)
      redirect_to "https://#{tenant_subdomain}.geoworks.com.ar"
    else
      redirect_to root_path, alert: "No se pudo cambiar de tenant."
    end
  end

end
