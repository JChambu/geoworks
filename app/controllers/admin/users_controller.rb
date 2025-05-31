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
    check_filter_ilike = params[:filter_ilike]
    attrs_filter = params[:attrs_filter]

    customer_name = Customer.where(id: id_corp).pluck(:subdomain).first

    Apartment::Tenant.switch customer_name do
      # Owner Filter
      filter_owner = ProjectFilter.where(user_id: user_selected_id, project_type_id: pro_id, owner: true)

      if filter_owner.empty? && check_filter_owner == 'true'
        @new_filter_owner = ProjectFilter.new(user_id: user_selected_id, project_type_id: pro_id, owner: true)
        @new_filter_owner.save
      end

      if !filter_owner.empty? && check_filter_owner == 'false'
        filter_owner.update(owner: false)
      end

      # Ilike Filter
      id = params['attrs_filter']['0']['id'].to_i

      filter_ilike = ProjectFilter.where(id: id)

      if !filter_ilike.empty? && check_filter_ilike == 'true'
        filter_ilike.update(ilike: true)
      elsif id != 0 && check_filter_ilike == 'false'
        filter_ilike.update(ilike: false)
      end

      # Attributes Filters
      attrs_filter_id = params['attrs_filter']['0']['id']
      attrs_filter_value = params['attrs_filter']['0']['filter']

      if attrs_filter_id == '0' && !attrs_filter_value.empty?
        @new_filter_attr = ProjectFilter.new(user_id: user_selected_id, project_type_id: pro_id, properties: attrs_filter_value, ilike: check_filter_ilike == 'true')
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

      # Crosslayer Filter
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
      filters_scope = ProjectFilter.where(user_id: user_selected_id, project_type_id: pro_id)

      filter_owner = filters_scope.find_by(owner: true)&.id
      filter_ilike = filters_scope.find_by(ilike: true)&.id
      attributes = filters_scope.where.not(properties: nil).pluck(:id, :properties)

      project_types = ProjectType.where.not(id: pro_id).pluck(:id, :name)

      cross_layer_filters = ProjectFilter
        .joins(:project_type)
        .where(user_id: user_selected_id, cross_layer_filter_id: attributes.map(&:first))
        .pluck(:cross_layer_filter_id, :id, :name, :project_type_id)

      filters = attributes.map do |attr_id, props|
        related_cross = cross_layer_filters.select { |c| c[0] == attr_id }
  
        used_project_type_ids = related_cross.map { |c| c[3] }
  
        {
          id: attr_id,
          name: props,
          cross_layer_filter: related_cross.map { |_, id, name, _| { id_cross_layer: id, name: name } },
          all_project_types: project_types.reject { |pt_id, _| used_project_type_ids.include?(pt_id) }
                                          .map { |pt_id, name| { id_project_type: pt_id, name: name } }
        }
      end
      render json: {owner: filter_owner, ilike: filter_ilike, attributes: filters}
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

    if params[:email].present? || params[:name].present? || params[:phone].present?
      @users = @users.where(" email ilike ?", "%#{params[:email]}%") unless params[:email].blank?
      @users = @users.where("name ilike ?",  "%#{params[:name]}%") unless params[:name].blank?
      @users = @users.where("phone ilike ?",  "%#{params[:phone]}%") unless params[:phone].blank?
    end

    if params[:email_sended] == 'false' && params[:confirmed_at] == 'nil'
      @users = @users.where(email_sended: false, confirmed_at: nil).order(:name)
    end

    @users = @users.paginate(:page => params[:page])
  end

  def send_confirmation_email
    DeviseCustomMailer.confirmation_instructions(@user, @user.confirmation_token).deliver_now
    @user.update(email_sended: true);
    redirect_to admin_users_path(email_sended: 'false', confirmed_at: 'nil'), notice: 'Correo de confirmación enviado.'
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
    params.require(:user).permit(:name, :email, :country_code, :area_code, :phone, :confirmed_at, :email_sended, :password, :password_confirmation, :company, :accept_terms, :active,
      user_customers_attributes: [:id, :user_id, :customer_id, :role_id, :_destroy,
      project_filters_attributes: [:id, :user_id, :project_type_id, :owner, :ilike, :_destroy]],
      has_project_types_attributes: [:id, :project_type_id, :user_id, :owner, :properties, :_destroy],
      user_customers_attributes: [:id, :user_id, :customer_id, :role_id, :_destroy]
    )
  end
end
