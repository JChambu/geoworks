class RegistrationsController < Devise::RegistrationsController
  before_action :configure_permitted_parameters, if: :devise_controller?
  after_action  :save_user_customer_filter, only: [:create]

  def save_user_customer_filter
    user_rol = Role.where(name: 'Público').pluck(:id).join(' ')
    user_project = ProjectType.where(name: 'Demo Público').pluck(:id).join(' ')
    new_user = User.last.id
    new_customer_for_user = UserCustomer.new(user_id: new_user, customer_id: current_tenant.id, role_id: user_rol)
    new_customer_for_user.save
    new_owner_filter = ProjectFilter.new(user_id: new_user, project_type_id: user_project, owner: true)
    new_owner_filter.save

    # puts ''
    # puts ' *************************** params *************************** '
    # p params
    # puts ' *********************************************************** '
    # puts ''
    #
    # puts ''
    # puts ' *************************** devise_parameter_sanitizer *************************** '
    # p devise_parameter_sanitizer
    # puts ' *********************************************************** '
    # puts ''
    #
    # puts ''
    # puts ' *************************** user_attr *************************** '
    # p params[:user]
    # puts ' *********************************************************** '
    # puts ''
    #
    # puts ''
    # puts ' *************************** user_customer_attr *************************** '
    # p params[:sign_up][:user_customers_attributes]
    # puts ' *********************************************************** '
    # puts ''
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:id, :name, :country_code, :area_code, :phone, user_customers_attributes: [:id, :user_id, :_destroy, :customer_id, :role_id], has_project_types_attributes: [:id, :properties, :_destroy, :project_type_id, :user_id, :owner]]).to_h

    puts ''
    puts ' *************************** devise_parameter_sanitizer CONFIG *************************** '
    p devise_parameter_sanitizer
    puts ' *********************************************************** '
    puts ''
  end

end
