class TableConfigurationsController < ApplicationController

  def create_table

    @table_configuration = TableConfiguration.new()
    @table_configuration.name = params[:name]
    @table_configuration.config = params[:config]
    @table_configuration.user_id = current_user.id
    @table_configuration.project_type_id = params[:project_type_id]

    if @table_configuration.save
      respuesta = 'Funcionó'
    else
      respuesta = 'FAIL'
    end

    render json: {
      "data": respuesta
    }
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

  def search_table
    @table = TableConfiguration.where(id: params[:table_configuration_id])
    render json: {data: @table}
  end

end
