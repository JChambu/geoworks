class ChoiceListsController < ApplicationController
  before_action :set_choice_list, only: [:show, :edit, :update, :destroy]

  # GET /choice_lists
  # GET /choice_lists.json
  def index
    @choice_lists = ChoiceList.all
  end

  # GET /choice_lists/1
  # GET /choice_lists/1.json
  def show
  end

  # GET /choice_lists/new
  def new
    @choice_list = ChoiceList.new
    @choice_list_item = @choice_list.choice_list_items.build 
  end

  # GET /choice_lists/1/edit
  def edit
  end

  # POST /choice_lists
  # POST /choice_lists.json
  def create
    @choice_list = ChoiceList.new(choice_list_params)

    respond_to do |format|
      if @choice_list.save
        format.html { redirect_to choice_lists_path, notice: 'Choice list was successfully created.' }
        format.json { render :show, status: :created, location: @choice_list }
      else
        format.html { render :new }
        format.json { render json: @choice_list.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /choice_lists/1
  # PATCH/PUT /choice_lists/1.json
  def update
    respond_to do |format|
      if @choice_list.update(choice_list_params)
        format.html { redirect_to choice_lists_path, notice: 'Choice list was successfully updated.' }
        format.json { render :show, status: :ok, location: @choice_list }
      else
        format.html { render :edit }
        format.json { render json: @choice_list.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /choice_lists/1
  # DELETE /choice_lists/1.json
  def destroy
    @choice_list.destroy
    respond_to do |format|
      format.html { redirect_to choice_lists_url, notice: 'Choice list was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_choice_list
      @choice_list = ChoiceList.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def choice_list_params
      params.require(:choice_list).permit(:name, :key, :value, :label, choice_list_items_attributes: [:id,:name])
    end
end
