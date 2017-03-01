class LocationsController < ApplicationController
  def cities
    #authorize! :index, :cities
    render json: City.filtered(params[:term], 10)
  end

  def provinces
    authorize! :index, :provinces
    render json: Country.find(params[:id]).provinces
  end

  def departments
    authorize! :index, :departments
    render json: Province.find(params[:id]).departments
  end

  def department_cities
    authorize! :index, :department_cities
    render json: Department.find(params[:id]).cities
  end
end
