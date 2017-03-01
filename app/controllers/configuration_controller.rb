class ConfigurationController < ApplicationController
	before_action :set_configuration, only: [:update]

	def index
    authorize! :index, AppConfiguration
		@configuration = AppConfiguration.first
	end

	def update
    authorize! :write, AppConfiguration
    respond_to do |format|
      if @configuration.update(config_params)        
        format.html { redirect_to configuration_url, flashman.update_success }
        format.json { head :no_content }
      else
        flashman.update_fail @configuration
        format.html { render action: 'index' }
        format.json { render json: @configuration.errors, status: :unprocessable_entity }
      end
    end
	end

  private
    def set_configuration
      @configuration = AppConfiguration.find(params[:id])
    end

    def config_params
      params.require(:app_configuration).permit(:gisworking_initial_identifier)
    end    
end
