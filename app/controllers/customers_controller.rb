class CustomersController < ApplicationController

  def search_customer
    @customer = Customer.where(subdomain: params[:current_tenement]).first
    cover = ProjectType.where(id: params[:project_type_id]).pluck(:cover).first
    data = {
      name: @customer.name,
      logo: @customer.logo,
      cover: cover,
      username: current_user.name
    }
    render json: data
  end

end
