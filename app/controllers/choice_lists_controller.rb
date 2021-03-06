class ChoiceListsController < ApplicationController
  before_action :set_choice_list, only: [:show, :edit, :update, :destroy, :export_csv]

  # GET /choice_lists
  # GET /choice_lists.json
  def index
    authorize! :choice_lists, :visualizer
    @choice_lists = ChoiceList.order(:name)
  end

  # GET /choice_lists/1
  # GET /choice_lists/1.json
  def show
  end

  # GET /choice_lists/new
  def new
    authorize! :choice_lists, :new
    @choice_list = ChoiceList.new
    @choice_list_item = @choice_list.choice_list_items.build
  end

  # GET /choice_lists/1/edit
  def edit
    authorize! :choice_lists, :edit
  end

  # POST /choice_lists
  # POST /choice_lists.json
  def create
    @choice_list = ChoiceList.new(choice_list_params)
    respond_to do |format|
      if @choice_list.save
        format.html { redirect_to choice_lists_path, notice: 'Listado creado correctamente' }
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
        format.html { redirect_to choice_lists_path, notice: 'Listado modificado correctamente' }
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
    authorize! :choice_lists, :destroy
    @project_field = ProjectField.where(choice_list_id: @choice_list.id)
    @project_subfield = ProjectSubfield.where(choice_list_id: @choice_list.id)
    @choice_list_item = ChoiceListItem.where(nested_list_id: @choice_list.id)

    respond_to do |format|
      if @project_field.any? || @project_subfield.any? || @choice_list_item.any?
        if @project_field.any? || @project_subfield.any?
          type = 'campo'
        else
          type = 'listado'
        end
        format.html { redirect_to choice_lists_url, notice: "No se puede eliminar el listado, está siendo usado por un #{type}" }
        format.json { head :no_content }
      else
        @choice_list.destroy
        format.html { redirect_to choice_lists_url, notice: 'El listado se eliminó correctamente' }
        format.json { head :no_content }
      end
    end
  end


  def import
    ChoiceList.import(params[:file])
    redirect_to choice_lists_url, notice: "Listados importados"
  end


  def export_csv
    @choice_list = ChoiceList.find(params[:id])
    respond_to do |format|
      format.html
      format.csv { send_data @choice_list.to_csv, filename: "#{@choice_list.name}-#{Date.today}.csv" }
    end
  end


  def export_all_csv
    @choice_lists = ChoiceList.all
    respond_to do |format|
     format.html
     format.csv { send_data @choice_lists.to_csv_all, filename: "Listados-#{Date.today}.csv" }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_choice_list
    @choice_list = ChoiceList.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def choice_list_params
    params.require(:choice_list).permit(:name, :description, :key, :value, :label, :_destroy,
      choice_list_items_attributes: [
        :id, :name, :nested_list_id, :_destroy
      ]
    )
  end
end
