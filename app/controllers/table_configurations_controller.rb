class TableConfigurationsController < ApplicationController

  def create_table
    @table_configuration = TableConfiguration.new()
    @table_configuration.name = params[:name]
    @table_configuration.config = params[:config]
    @table_configuration.user_id = current_user.id
    @table_configuration.project_type_id = params[:project_type_id]

    if @table_configuration.save
      render json: {
        'status': 'La configuración se guardó correctamente.',
        'table_id': @table_configuration.id
      }
    else
      render json: {
        'status': 'No se pudo guardar la configuración.'
      }
    end
  end


  def edit_table
    id = params[:table_id]
    unless id.nil?
      name  = params[:name]
      config = params[:config]
      @table_configuration = TableConfiguration.where(id: id).first
      @table_configuration.name = name
      @table_configuration.config = config
      @table_configuration.save
      render json: {'status': 'Se actualizó la configuración.'}
    else
      render json: {'status': 'Faltan parámetros para completar la acción.'}
    end
  end

  def destroy_table
    id = params[:table_id]
    unless id.nil?
      @table_configuration = TableConfiguration.where(id: id).first
      @table_configuration.destroy
      render json: {'status': 'Se eliminó la configuración.'}
    else
      render json: {'status': 'Faltan parámetros para completar la acción.'}
    end
  end

  def search_table
    @table = TableConfiguration.where(id: params[:table_configuration_id])
    render json: {data: @table}
  end

  def share_table_between_users
    table_id = params[:table_id].to_i
    project_type_id = params[:project_type_id].to_i
    current_tenant = Apartment::Tenant.current
    customer_id = Customer.find_by(subdomain: current_tenant)

    table_to_share = TableConfiguration.find(table_id)
    config_to_share = table_to_share.config

    existing_user_ids = TableConfiguration.where(config: config_to_share, project_type_id: project_type_id).pluck(:user_id)

    users_to_share = User.joins(:user_customers)
                     .where(user_customers: {customer_id: customer_id})
                     .where.not(id: HasProjectType.select(:user_id).where(project_type_id: project_type_id))
                     .where.not(id: existing_user_ids)
                     .sorted_by_name
                     .map { |user| [user.some_identifier, user.id] }

    respond_to do |format|
      format.html { render partial: 'share_tables', locals: { table_id: table_id, users_to_share: users_to_share } }
    end
  end

  def save_shared_tables
    table_id = params[:table_id].to_i
    project_type_id = params[:project_type_id].to_i
    users_ids = params[:user_ids]
    table_to_share = TableConfiguration.find(table_id)

    if !users_ids.nil?
      users_ids.each do |user_id|
        new_table_config = table_to_share.dup
        new_table_config.user_id = user_id
        new_table_config.save!
      end
    end

    respond_to do |format|
      format.js { render 'save_shared_tables' }
    end
  end

end
