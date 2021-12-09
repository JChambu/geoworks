class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_locale
  before_action :current_tenant
  helper_method :flashman
  layout :layout_by_resource
  def layout_by_resource
    if devise_controller? and
        resource_name == :user and
        action_name == 'new'
      "login"
    else
      "application"
    end
  end

  def flashman
    @flash_manager
  end

  def set_locale
    I18n.locale = params[:locale] if params[:locale].present?
  end

  def default_url_options(options = {})
    {locale: I18n.locale}
  end

  def current_tenant
    @current_tenant ||= Customer.find_by(subdomain: request.subdomain)
  end


end
