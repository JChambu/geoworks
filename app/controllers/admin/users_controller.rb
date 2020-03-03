class Admin::UsersController < ApplicationController
  #before_filter :new_user, :only => [:create]
  load_and_authorize_resource except: [:search_projects]
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  layout 'admin'
  # GET /users
  # GET /users.json

  def search_projects
    @p = ProjectType.search_projects_for_tenant  params 
  end

  def search_roles
    @r = Role.search_roles_for_tenant params
  end

  def search_fields
    @f = ProjectField.search_fields_for_tenant params
  end

  def search_properties_data
    @data = Project.search_properties_data_for_tenant params
  end

  def index
    Apartment::Tenant.switch! 'public'
    
    @users = User.all
    if params[:email].present? || params[:name].present?
      @users = @users.where(" email ilike ?", "%#{params[:email]}%") unless params[:email].blank?
      @users = @users.where("name ilike ?",  "%#{params[:name]}%") unless params[:name].blank?
    end
    @users = @users.paginate(:page => params[:page])
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
    @current_tenant = Apartment::Tenant.current
    @customer = Customer.where(subdomain: current_tenant).first
    @role_id =  UserCustomer.where(user_id: params[:id]).where(customer_id: @customer.id).pluck(:role_id).first
  end

  # POST /users
  # POST /users.json
  def create
    respond_to do |format|
      if @user.save      
        @user_customers = UserCustomer.new
        @user_customers[:user_id] = @user.id
        @current_tenant = params[:user][:customer_id]
        @customer = Customer.where(subdomain: @current_tenant).first
        @user_customers[:customer_id] = @customer.id
        @user_customers[:role_id] = params[:user][:role].to_i
        @user_customers.save!
        params[:id] = @user.id
        user_filters = User.save_filters params
        format.html { redirect_to admin_users_path() }
        format.json { render action: 'show', status: :created, location: @user }
      else
        format.html { render action: 'new' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end 

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    @current_tenant = Apartment::Tenant.current
    customer_id = Customer.where(name: @current_tenant)
    user_id = current_user.id
    user_customer = UserCustomer.where(customer_id: customer_id).where(user_id: params[:id])
    respond_to do |format|
      if @user.update(user_params)     
        user_customer = user_customer.update(role_id: params[:role_id]['id'].to_i )
        user_filters = User.save_filters params
        UserMailer.new_user(@user).deliver_now
        format.html { redirect_to admin_users_path() }
        format.json { head :no_content }
      else
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

  private
  def after_confirmation_path_for(resource_name, resource)
    sign_up(resource)
  end

  def set_user
    @user = User.find(params[:id])
  end

  def new_user
    @user = User.new(user_params)
  end

  def user_params
    params.require(:user).permit(:email, :password, :name, :password_confirmation, :active, :role_id, has_project_types_attributes: [:id, :project_type_id, :user_id, :_destroy, :owner, :properties])
  end
end
