class CustomersController < ApplicationController

  def search_customer
    @customer = Customer.where(subdomain: params[:current_tenement]).first
    data = {
      name: @customer.name,
      logo: @customer.logo
    }
    render json: data
  end

end
