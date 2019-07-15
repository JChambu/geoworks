class UsersController < ApplicationController
  #before_filter :new_user, :only => [:create]
  load_and_authorize_resource
  before_action :set_user, only: [:show, :edit, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    @users = User.paginate(:page => params[:page])
  end

  # GET /users/1
  # GET /users/1.json
  def show
  end

  # GET /users/new
  def new
  end

  # GET /users/1/edit
  def edit
  end

  # POST /users
  # POST /users.json
  def create

    respond_to do |format|
      if @user.save       
       @user_customers =  UserCustomer.new
       @user_customers[:user_id] = @user.id
        @current_tenant = Apartment::Tenant.current
        @customer = Customer.where(subdomain: current_tenant).first
        @user_customers[:customer_id] = @customer.id
        @user_customers[:role_id] = params[:user][:role].to_i
       @user_customers.save!
        format.html { redirect_to @user, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @user }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end 

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)        
        format.html { redirect_to @user, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail
        format.html { render action: 'edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    if @user.destroy
      flashman.destroy_success
    else
      flashman.destroy_fail @user
    end

    respond_to do |format|
      format.html { redirect_to users_url }
      format.json { head :no_content }
    end
  end
    
  def build_token
       authentication_token = SecureRandom.base64(64)
  end

  private
    def set_user
      @user = User.find(params[:id])
    end

    def new_user
      @user = User.new(user_params)
    end

    def user_params
      params.require(:user).permit(:email, :password, :name, :role, :password_confirmation).merge(token: build_token)
    end
end
