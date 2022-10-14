class ReportsController < ApplicationController

  skip_before_action :authenticate_user!, :only => :get_reports
  skip_authorize_resource :only => :get_reports

  def get_reports
    @hola = [1, 2, 3]

    respond_to do |format|
      format.html
    end
  end


  private
  # def user_params
  #   params.require(:user).permit(:name, :email, :country_code, :area_code, :phone, :password, :password_confirmation, :active,
  #     has_project_types_attributes: [:id, :project_type_id, :user_id, :owner, :properties, :_destroy],
  #     user_customers_attributes: [:id, :user_id, :customer_id, :role_id, :_destroy]
  #   )
  # end
end
