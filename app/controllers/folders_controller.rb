class FoldersController < ApplicationController
  before_action :set_folder, only: %i[show edit update destroy]

  def index
    @folders = Folder.all
  end

  def show
  end

  def new
    @folder = Folder.new
  end

  def edit
  end

  def create
    @folder = Folder.new(folder_params)

    respond_to do |format|
      if @folder.save
        format.html { redirect_to folders_path, notice: 'Carpeta creada correctamente' }
        format.json { render :show, status: :created, location: @folder }
      else
        format.html { render :new }
        format.json { render json: @folder.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @folder.update(folder_params)
        format.html { redirect_to folders_path, notice: 'Carpeta modificada correctamente' }
        format.json { render :show, status: :ok, location: @folder }
      else
        format.html { render :edit }
        format.json { render json: @folder.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @folder.destroy
    redirect_to folders_url, notice: 'La carpeta se eliminó correctamente.'
  end

  private

  def set_folder
    @folder = Folder.find(params[:id])
  end

  def folder_params
    params.require(:folder).permit(:name)
  end
end
