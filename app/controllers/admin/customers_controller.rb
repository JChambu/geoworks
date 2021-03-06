class Admin::CustomersController < ApplicationController

  load_and_authorize_resource

  before_action :set_customer, only: [:show, :edit, :update, :destroy]
  layout 'admin'

  # GET /customers
  # GET /customers.json
  def index
    @customers = Customer.all
  end

  # GET /customers/1
  # GET /customers/1.json
  def show
  end

  # GET /customers/new
  def new
    @customer = Customer.new
  end

  # GET /customers/1/edit
  def edit
  end

  # POST /customers
  # POST /customers.json
  def create

    if params[:customer][:logo].present?
      encode_image
    end

    @customer = Customer.new(customer_params)

    respond_to do |format|
      if @customer.save
        format.html { redirect_to admin_customers_url, notice: 'La corporación se creó correctamente.' }
      else
        format.html { render :new }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /customers/1
  # PATCH/PUT /customers/1.json
  def update

    if params[:customer][:logo].present?
      encode_image
    end

    respond_to do |format|
      if @customer.update(customer_params)
        format.html { redirect_to admin_customers_url, notice: 'La corporación se actualizó correctamente.' }
      else
        format.html { render :edit }
        format.json { render json: @customer.errors, status: :unprocessable_entity }
      end
    end

  end

  # DELETE /customers/1
  # DELETE /customers/1.json
  def destroy
    @customer.destroy
    respond_to do |format|
      format.html { redirect_to admin_customers_url, notice: 'La corporación se eliminó correctamente.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_customer
      @customer = Customer.find(params[:id])
    end

    def encode_image
      params[:customer][:logo] = Base64.strict_encode64(File.read(params[:customer][:logo].path))
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def customer_params
      params.require(:customer).permit(:name, :subdomain, :logo)
    end
end
