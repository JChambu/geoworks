class Projects::ImportsController < ApplicationController
  def new
    @project_type = current_user.project_types.find(params[:project_type_id])
    path_to_file = temp_import_file_path(@project_type.id, current_user.id)
    File.delete(path_to_file) if File.exist?(path_to_file)

    @project_data_child = ProjectDataChild.new
    @project_data_children_no_valid = []
  end

  def create
    @project_type = current_user.project_types.eager_load(:project_fields).find(params[:project_type_id])

    @projects_no_valid = []
    #
    # is_from_form = params[:data_children].present?
    #
    path_to_temp_file = temp_import_file_path(@project_type.id, current_user.id)
    # is_from_file = File.exist?(path_to_temp_file)
    #
    # if !is_from_form && !is_from_file
    #   flash.now[:alert] = "Archivo es requerido"
    #   render action: :new
    #   return
    # end
    #
    mapping = nil
    begin
      content = File.read(temp_import_file_path(@project_type.id, current_user.id))
      json = JSON.parse(content)
      data_hash = json["features"]

      mapping = params[:mapping]
      @project_import = ProjectImport.new
      @project_import.current_user = current_user
      @project_import.project_type = @project_type
      @project_import.entries = data_hash
      @project_import.mapping = mapping
      @projects_no_valid = @project_import.save

      if @projects_no_valid.length == 0
        message = "Se procesaron #{data_hash.length} registros correctamente"
        redirect_to new_project_type_projects_import_path(@project_type), flash: { notice: message }
      else
        errors = {
          type: json['type'],
          "name": json['name'],
          "crs": json['crs'],
          "features": @projects_no_valid.as_json
        }

        create_errors_file(errors, @project_type)
        projects_processed = data_hash.length - @projects_no_valid.length
        flash.now[:notice] = "Se procesaron #{projects_processed} registros correctamente" if projects_processed > 0
        flash.now[:alert] = "Se encontraron #{@projects_no_valid.length} registros sin procesar"
        return
      end
    rescue => e
      p '*' * 100
      p e
      flash.now[:alert] = "Archivo seleccionado no tiene el formato GEOJSON"
      render action: :new
      return
    end
  end

  def read_file
    @project_type = current_user.project_types.find(params[:project_type_id])
    if params[:file].blank?
      flash.now[:alert] = "Archivo es requerido"
      render action: :new
      return
    end
    begin
      if File.extname(params[:file].path) != '.geojson'
        flash.now[:alert] = "Archivo seleccionado no tiene el formato geojson"
        render action: :new
        return
      end
      content = File.read(params[:file].path)
      File.open(temp_import_file_path(@project_type.id, current_user.id),"w") do |f|
        f.write(content)
      end
      redirect_to mapping_project_type_projects_import_path(@project_type)
    rescue => e
      p '*' * 100
      p e
      flash.now[:alert] = "Archivo seleccionado no tiene el formato geojson"
      render action: :new
      return
    end
  end

  def mapping
    @project_type = current_user.project_types.find(params[:project_type_id])
    path_to_file = temp_import_file_path(@project_type.id, current_user.id)
    redirect_to action: :new and return unless File.exist?(path_to_file)
    content = File.read(temp_import_file_path(@project_type.id, current_user.id))
    @file_headers = JSON.parse(content)["features"].first["properties"].keys
    @project_mapping = @project_type.project_fields.where.not(field_type_id: [FieldType::SUBFORM, FieldType::SUBTITLE]).pluck(:key, :name)
    @locale = params[:locale]
  end

  def download_errors
    @project_type = current_user.project_types.find(params[:project_type_id])
    send_file "public/importing_project_for_#{@project_type.id}_errors.json", type: 'application/json', status: 202
  end

  private

  def temp_import_file_path(project_type_id, user_id)
    "public/importing_project_for_#{project_type_id}_from_user_#{user_id}.csv"
  end

  def create_errors_file(errors, project_type)
    File.open("public/importing_project_for_#{project_type.id}_errors.json","w") do |f|
      f.write(JSON.pretty_generate(errors))
    end
  end
end
