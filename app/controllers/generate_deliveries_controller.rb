class GenerateDeliveriesController < ApplicationController
  before_action :set_generate_delivery, only: [:show, :edit, :update, :destroy]

  # GET /generate_deliveries
  # GET /generate_deliveries.json
  def index
    @generate_deliveries = GenerateDelivery.all
  end

  # GET /generate_deliveries/1
  # GET /generate_deliveries/1.json
  def show
  end

  # GET /generate_deliveries/new
  def new
    @generate_delivery = GenerateDelivery.new
  end

  # GET /generate_deliveries/1/edit
  def edit
  end

  # POST /generate_deliveries
  # POST /generate_deliveries.json
  def create
    @generate_delivery = GenerateDelivery.new(generate_delivery_params)

#    @generate = GenerateDelivery.gen(params[:generate_delivery][:name], params[:generate_delivery][:country_id])

    respond_to do |format|
      if @generate_delivery.save
        format.html { redirect_to @generate_delivery, notice: 'Generate delivery was successfully created.' }
        format.json { render action: 'show', status: :created, location: @generate_delivery }
      else
        format.html { render action: 'new' }
        format.json { render json: @generate_delivery.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /generate_deliveries/1
  # PATCH/PUT /generate_deliveries/1.json
  def update
    respond_to do |format|
      if @generate_delivery.update(generate_delivery_params)
        format.html { redirect_to @generate_delivery, notice: 'Generate delivery was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @generate_delivery.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /generate_deliveries/1
  # DELETE /generate_deliveries/1.json
  def destroy
    @generate_delivery.destroy
    respond_to do |format|
      format.html { redirect_to generate_deliveries_url }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_generate_delivery
      @generate_delivery = GenerateDelivery.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def generate_delivery_params
      params.require(:generate_delivery).permit(:name, :country_id)
    end
end
