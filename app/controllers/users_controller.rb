class UsersController < ApplicationController
  before_action :set_user, only: [:edit, :update]

  # GET /users/1/edit
  def edit
  end

  # Busca user_id y customer_id para creación de "id único" en front
  def get_user_id_and_customer_id
    customer_id = Customer.where(subdomain: params[:current_tenement]).pluck(:id).first
    data = {
      user_id: current_user.id,
      customer_id: customer_id
    }
    render json: data
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
        UserMailer.edit_user(@user).deliver_now
        format.html { redirect_to root_path}
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  private
  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:email, :password, :name, :role, :country_code, :area_code, :phone, :password_confirmation)
  end
end
