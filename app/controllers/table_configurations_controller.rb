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

  def search_table
    @table = TableConfiguration.where(id: params[:table_configuration_id])
    render json: {data: @table}
  end

end
