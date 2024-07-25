class Admin::UsersController < ApplicationController
  #before_filter :new_user, :only => [:create]
  load_and_authorize_resource except: [:search_projects]
  before_action :set_user, only: [:show, :edit, :update, :destroy, :send_confirmation_email]
  layout 'admin'
  # GET /users
  # GET /users.json

  def search_projects
    @p = ProjectType.search_projects_for_tenant params['customer_id']
    render json: {data: @p}
  end

  def create_filters
    id_corp = params[:id_corporacion]
    user_selected_id = params[:user_selected_id]
    pro_id = params[:project_id]
    check_filter_owner = params[:filter_owner]
    attrs_filter = params[:attrs_filter]

    customer_name = Customer.where(id: id_corp).pluck(:subdomain).first
    Apartment::Tenant.switch customer_name do
      #Filter owner
      filter_owner = ProjectFilter.all.where(user_id: user_selected_id).where(project_type_id: pro_id).where(owner: true)

      if filter_owner.empty? && check_filter_owner == 'true'
        @new_filter_owner = ProjectFilter.new(user_id: user_selected_id, project_type_id: pro_id, owner: true)
        @new_filter_owner.save
      end

      if !filter_owner.empty? && check_filter_owner == 'false'
        filter_owner.update(owner: false)
      end

      #Attributes filters
      attrs_filter_id = params['attrs_filter']['0']['id']
      attrs_filter_value = params['attrs_filter']['0']['filter']

      if attrs_filter_id == '0' && !attrs_filter_value.empty?
        @new_filter_attr = ProjectFilter.new(user_id: user_selected_id, project_type_id: pro_id, properties: attrs_filter_value)
        @new_filter_attr.save
      end

      if attrs_filter_id != '0'
        filter_attr = ProjectFilter.all.where(id: attrs_filter_id).first

        if attrs_filter_value.empty?
          filter_attr.delete
          clf = ProjectFilter.all.where(user_id: user_selected_id, cross_layer_filter_id: attrs_filter_id).destroy_all
        else
          filter_attr.update(properties: attrs_filter_value)
        end
      end

      #Cross layer filter
      attrs_filter_value = params['attrs_filter']['0']['cross_layer']
      if !attrs_filter_value.nil?
        attrs_filter_value = attrs_filter_value.values
        attrs_filter_value.each do |afv|
          attrs_filter_value_id = afv['id']
          attrs_filter_value_check = afv['checked']

          if attrs_filter_value_id != '0' && attrs_filter_value_check == 'false'
            cross_layer_iterate = ProjectFilter.all.where(id: attrs_filter_value_id).first
            cross_layer_iterate.delete
          end
        end
      end

      interlayer_filters_new = params['attrs_filter']['0']['interlayer_filters_new']
      if !interlayer_filters_new.nil?
        interlayer_filters_new = interlayer_filters_new.values
        interlayer_filters_new.each do |ifn|
          ifn_project_id = ifn['id_project']
          ifn_cross_layer_id = ifn['cross_layer_id']
          new_cross_layer_filter = ProjectFilter.new(user_id: user_selected_id, project_type_id: ifn_project_id, cross_layer_filter_id: ifn_cross_layer_id)
          new_cross_layer_filter.save
        end
      end
    end
  end

  # Busca los roles luego de seleccionar la corporación
  def search_roles
    @r = Role.search_roles_for_tenant params['customer_id']
  end

  def search_filters

    id_corp = params[:id_corporacion]
    user_selected_id = params[:user_selected_id]
    pro_id = params[:project_id]

    customer_name = Customer.where(id: id_corp).pluck(:subdomain).first
    Apartment::Tenant.switch customer_name do
      filter_owner = ProjectFilter.all.where(user_id: user_selected_id).where(project_type_id: pro_id).where(owner: true).pluck(:id).last
      attributes = ProjectFilter.all.where(user_id: user_selected_id).where(project_type_id: pro_id).where.not(properties: nil).pluck(:id, :properties)
      filters = []

      attributes.each do |a|
        filter = {}

        filter["id"] = a[0]
        filter["name"] = a[1]
        cross_layer_filter = ProjectFilter.joins(:project_type).where(user_id: user_selected_id).where(cross_layer_filter_id: a).pluck(:id, :name, :project_type_id)
        all_cross_layers = []
        project_types = ProjectType.all.where.not(id: pro_id).pluck(:id, :name)
        all_project_types = []
        id_filters_check = []

        cross_layer_filter.each do |cl|
          filter_cross_layer = {}
          filter_cross_layer['id_cross_layer'] = cl[0]
          filter_cross_layer['name'] = cl[1]
          all_cross_layers.push(filter_cross_layer)
          id_filters_check.push(cl[2])
        end

        project_types.each do |pt|
          if !id_filters_check.include?(pt[0])
            project_type_for_object = {}
            project_type_for_object['id_project_type'] = pt[0]
            project_type_for_object['name'] = pt[1]
            all_project_types.push(project_type_for_object)
          end
        end

        filter["cross_layer_filter"] = all_cross_layers
        filter["all_project_types"] = all_project_types

        filters.push(filter)
      end
      render json: {owner: filter_owner, attributes: filters}
    end
  end

  def projects
    respond_to do |format|
      format.html
      format.js
    end
  end

  def search_fields
    @f = ProjectField.search_fields_for_tenant params
  end

  def search_properties_data
    @data = Project.search_properties_data_for_tenant params
  end

  def index
    users_in_corporation = UserCustomer.where(customer_id: current_tenant.id).pluck(:user_id)
    Apartment::Tenant.switch! 'public'
    @users = User.where(id: users_in_corporation).order(:name)

    if params[:email].present? || params[:name].present? || params[:phone]
      @users = @users.where(" email ilike ?", "%#{params[:email]}%") unless params[:email].blank?
      @users = @users.where("name ilike ?",  "%#{params[:name]}%") unless params[:name].blank?
      @users = @users.where("phone ilike ?",  "%#{params[:phone]}%") unless params[:phone].blank?
    end
    @users = @users.paginate(:page => params[:page])
  end

  def send_confirmation_email
    DeviseCustomMailer.confirmation_instructions(@user, @user.confirmation_token).deliver_now
    redirect_to admin_users_path(), notice: 'Correo de confirmación enviado.'
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
    if @user.valid?
      @user.save
      respond_to do |format|
        format.html { redirect_to admin_users_path() }
        format.json { render action: 'show', status: :created, location: @user }
      end
    else
      flash.now[:error] = @user.errors.full_messages.join(', ')
      render 'new'
    end
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    respond_to do |format|
      if @user.update(user_params)
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
    params.require(:user).permit(:name, :email, :country_code, :area_code, :phone, :confirmed_at, :password, :password_confirmation, :active,
      user_customers_attributes: [:id, :user_id, :customer_id, :role_id, :_destroy,
      project_filters_attributes: [:id, :user_id, :project_type_id, :owner, :_destroy]],
      has_project_types_attributes: [:id, :project_type_id, :user_id, :owner, :properties, :_destroy],
      user_customers_attributes: [:id, :user_id, :customer_id, :role_id, :_destroy]
    )
  end
end
