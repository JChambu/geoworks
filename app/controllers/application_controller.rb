class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

 # rescue_from CanCan::AccessDenied do |exception|
 #   redirect_to root_url, :flash => { :error => t("flash_message.authorized_access") }
 # end

  before_filter :authenticate_user!
  before_filter :set_flash_manager
  before_filter :set_locale 
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

  def set_flash_manager
   # @flash_manager = Geoworks::FlashManager.new(controller_path, flash)
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
