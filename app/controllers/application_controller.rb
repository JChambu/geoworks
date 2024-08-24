class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_locale
  before_action :current_tenant
  before_action :disable_paper_trail_for_fepedi
  helper_method :flashman
  layout :layout_by_resource

  def layout_by_resource
    if devise_controller? && resource_name == :user && action_name == 'new' || action_name == 'create'
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

  def disable_paper_trail_for_fepedi
    PaperTrail.request.enabled = !(Apartment::Tenant.current == 'fepedi')
  end

end
