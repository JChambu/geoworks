class LoadLocationsController < ApplicationController

  #before_filter :new_load_location, :only => [:create]
  load_and_authorize_resource

  def index

  end

  def new
  end

  def create
    
    respond_to do |format|
      if @load_location.save
        format.html { redirect_to load_locations_path, flashman.create_success }
        format.json { render action: 'show', status: :created, location: @load_location }
      else
        flashman.create_fail
        format.html { render action: 'new' }
        format.json { render json: @food_type.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def new_load_location
    @load_location = LoadLocation.new(load_location_params)
  end

  def load_location_params
    params.require(:load_location).permit(:name, :file)
  end
end
