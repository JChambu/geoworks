class ApiConnectionsController < ApplicationController
  before_action :set_project_type
  before_action :set_api_connection, unless: -> { action_name == 'sync_subform' }

  def create
    @subfield_id = params["subfield_id"]
    redirect_to api_connection_subform_path(@project_type_id, subfield_id: @subfield_id)
  end

  def create_subform
    @project_type = ProjectType.find(params[:id])
    require 'net/http'
    require 'uri'
    require 'json'

    url_params = params[:api_connection][:url].scan(/\?/).count
    if url_params == 0
      uri = URI.parse(api_connection_params["url"] + "?fecha=01-01-1800")
    elsif url_params == 1
      uri = URI.parse(api_connection_params["url"])
    end

    request = Net::HTTP::Get.new(uri)
    request['Content-Type'] = params[:api_connection][:content_type]
    request['Authorization'] = params[:api_connection][:authorization]
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      # If the response is successful (status code 2xx)
      response_data = JSON.parse(response.body)
      first_result = response_data[api_connection_params["key_api"]]
      @subfield_id = params[:api_connection]["subfield_id"]
      if first_result.nil?
        respond_to do |format|
          format.html { redirect_to api_connection_subform_path(@project_type_id, subfield_id: @subfield_id), notice: 'No se encontraron datos para sincronizar con la fecha configurada' }
        end
      else
        @keys = first_result.flat_map(&:keys).uniq
        @api_connection_to_save = ApiConnection.where(project_type_id: @project_type.id).where(subfield_id: api_connection_params["subfield_id"]).first
        if @api_connection_to_save.nil?
          respond_to do |format|
            @api_connection = ApiConnection.new(api_connection_params)
            if @api_connection.save
              format.html { redirect_to api_connection_mapping_path(subfield_id: api_connection_params["subfield_id"], keys: @keys), notice: 'La conexión a la api fue creada exitosamente.' }
              #format.json { render action: 'show', status: :created, location: @api_connection }
            else
              format.html { redirect_to api_connection_path, notice: 'Api Conection failed' }
              format.json { render json: @api_connection.errors.full_messages, status: :unprocessable_entity }
            end
          end
        else
          respond_to do |format|
            if @api_connection_to_save.update(api_connection_params)
              format.html { redirect_to api_connection_mapping_path(subfield_id: api_connection_params["subfield_id"], keys: @keys), notice: 'La conexión a la api fue actualizada exitosamente.' }
              #format.json { render action: 'show', status: :created, location: @api_connection }
            else
              format.html { redirect_to api_connection_path, notice: 'Falló la conexión a la api' }
              format.json { render json: @api_connection.errors.full_messages, status: :unprocessable_entity }
            end
          end
        end
      end
    else
      puts "La solicitud falló con el código de estado: #{response.code}"
      respond_to do |format|
        format.html { redirect_to api_connection_path, notice: 'Falló la conexión a la api' }
        format.json { render json: @api_connection.errors.full_messages, status: :unprocessable_entity }
      end
    end
  end

  def create_mapping
    @mapped_fields = JSON.parse(api_connection_params["mapped_fields"])
    @api_connection_to_save = ApiConnection.where(project_type_id: @project_type.id).where(subfield_id: api_connection_params["subfield_id"]).first
    unless @api_connection_to_save.nil?
      if @api_connection_to_save.update_attribute(:mapped_fields, @mapped_fields)
        respond_to do |format|
          format.html { redirect_to api_connection_path, notice: 'El mapeo de campos se guardó correctamente'}
          #format.json { render action: 'show', status: :created, location: @api_connection }
        end
      else
        respond_to do |format|
          format.html { redirect_to api_connection_path, notice: 'Falló la conexión a la api' }
          format.json { render json: @api_connection.errors.full_messages, status: :unprocessable_entity }
        end
      end
    end
  end


  def api_connection_mapping
    @keys = params[:keys]
    @subfield_id = params[:subfield_id]
    @project_field = ProjectField.where(id: @subfield_id).first
    @project_subfields = ProjectSubfield
    .where(project_field_id: @subfield_id)
    .where.not(field_type_id: 11)
    .where.not(name: "app_unique_key")
    .order(:sort)
  end

  def sync_subform
    @api_connection_to_sync = ApiConnection.where(project_type_id: @project_type.id).where(subfield_id: params["subfield_id"]).first
    @return_data = {}

    if @api_connection_to_sync.nil?
      @return_data[:result] = "No existe una configuración para sincronizar este formulario."
      @return_data[:success] = false
    else
      @url = @api_connection_to_sync.url
      @key_api = @api_connection_to_sync.key_api

      if @url.nil? || @key_api.nil?
        @return_data[:result] = "Revise los parámetros API url y Key en la configuración."
        @return_data[:success] = false
      else
        require 'net/http'
        require 'uri'
        require 'json'

        url_params = @url.scan(/\?/).count
        if url_params == 0
          uri = URI.parse(@url + "?fecha=01-01-1800")
        elsif url_params == 1
          uri = URI.parse(@url)
        end

        request = Net::HTTP::Get.new(uri)
        request['Content-Type'] = @api_connection_to_sync.content_type
        request['Authorization'] = @api_connection_to_sync.authorization
        response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
          http.request(request)
        end

        if response.is_a?(Net::HTTPSuccess)
          response_data = JSON.parse(response.body)
          analysis_type = @api_connection_to_sync.mapped_fields["analysis_type_name"]
          analysis_type_id = @api_connection_to_sync.mapped_fields["analysis_type_id_field"].to_i

          if !@api_connection_to_sync.mapped_fields["analysis_type_name"].empty? && !@api_connection_to_sync.mapped_fields["analysis_type_id_field"].empty?
            results = response_data[@api_connection_to_sync.key_api]
            filtered_results = results.select { |result| result["#{analysis_type}"] == analysis_type_id }
            results = filtered_results
          else
            results = response_data[@api_connection_to_sync.key_api]
          end

          if results.nil?
            @return_data[:result] = "No se encontraron datos para sincronizar para la Key configurada."
            @return_data[:success] = false
          else
            @return_data[:result] = results.length
            @return_data[:success] = true
          end
        else
          # If the response is not successful
          @return_data[:result] = "La conexión falló con el siguiente error: #{response.code}"
          @return_data[:success] = false
        end
      end
    end
    render json: @return_data
  end

  def sync_subform_confirm
    @api_connection_to_sync = ApiConnection.where(project_type_id: @project_type.id).where(subfield_id: params["subfield_id"]).first
    @return_data = {}
    @url = @api_connection_to_sync.url
    @key_api = @api_connection_to_sync.key_api

    require 'net/http'
    require 'uri'
    require 'json'

    url_params = @url.scan(/\?/).count
    if url_params == 0
      uri = URI.parse(@url + "?fecha=01-01-1800")
    elsif url_params == 1
      uri = URI.parse(@url)
    end

    request = Net::HTTP::Get.new(uri)
    request['Content-Type'] = @api_connection_to_sync.content_type
    request['Authorization'] = @api_connection_to_sync.authorization
    response = Net::HTTP.start(uri.host, uri.port, use_ssl: uri.scheme == 'https') do |http|
      http.request(request)
    end

    if response.is_a?(Net::HTTPSuccess)
      response_data = JSON.parse(response.body)

      analysis_type = @api_connection_to_sync.mapped_fields["analysis_type_name"]
      analysis_type_id = @api_connection_to_sync.mapped_fields["analysis_type_id_field"].to_i

      if !@api_connection_to_sync.mapped_fields["analysis_type_name"].empty? && !@api_connection_to_sync.mapped_fields["analysis_type_id_field"].empty?
        results = response_data[@api_connection_to_sync.key_api]
        @filtered_results = results.select { |result| result["#{analysis_type}"] == analysis_type_id }
        results = @filtered_results
      else
        results = response_data[@api_connection_to_sync.key_api]
      end
      @unique_field = ProjectSubfield
        .select(:id)
        .where(:project_field_id => params["subfield_id"])
        .where(:name => "app_unique_key")
        .pluck(:id)
        .first
      @error_count = 0
      @not_saved_array = []
      @new_count = 0
      @update_count = 0
      @unique_field_mapped_nil = 0
      @parent_id_mapped_nil = 0
      @updated_at_mapped_nil = 0
      @created_at_mapped_nil = 0
      @user_id_mapped_nil = 0
      @no_project_id_project_field_id = 0
      @sample_point_id = []

      if @unique_field.nil?
        @return_data[:result] = "No se pudo encontrar un campo único en el modelo de datos (app_unique_key)."
      else
        # iterate over results to determinite if is update or create
        @mapped_fields = @api_connection_to_sync.mapped_fields
        if @mapped_fields.nil?
          @return_data[:result] = "No hay guardado ningún mapeo de campos."
        else
          @unique_field_from_api = @mapped_fields["unique_field"]
          @parent_id_from_api = @mapped_fields["parent_id"]
          @updated_at_from_api = @mapped_fields["updated_at"]
          @created_at_from_api = @mapped_fields["created_at"]
          if @mapped_fields["user_id"].nil? || @mapped_fields["user_id"] == ""
            @user_is_mapped = false
          else
            @user_id_from_api = @mapped_fields["user_id"]
            @user_is_mapped = true
          end

          @mapping_from_api = @mapped_fields["mapping"]
          if @mapping_from_api.nil?
            @return_data[:result] = "El mapeo de campos está vacío"
          else
            @last_error_count = 0
            results.each do |r|
              @unique_field_mapped = r[@unique_field_from_api]
              @parent_id_mapped = r[@parent_id_from_api]
              @updated_at_mapped = r[@updated_at_from_api]
              @created_at_mapped = r[@created_at_from_api]

              if @user_is_mapped
                @user_id_mapped = r[@user_id_from_api]
              else
                @user_id_mapped = current_user.id
              end

              if @unique_field_mapped.nil?
                #el registro a sincronizar no contiene un campo de identificación único
                @error_count += 1
                @unique_field_mapped_nil += 1
                @not_saved_array.push(r)
              elsif @parent_id_mapped.nil?
                #el registro a sincronizar no contiene un id del padre
                @error_count += 1
                @not_saved_array.push(r)
              elsif @updated_at_mapped.nil?
                #el registro a sincronizar no contiene updated_at
                @error_count += 1
                @updated_at_mapped_nil += 1
                @not_saved_array.push(r)
              elsif @created_at_mapped.nil?
                #el registro a sincronizar no contiene created_at
                @error_count += 1
                @created_at_mapped_nil += 1
                @not_saved_array.push(r)
              elsif @user_id_mapped.nil?
                #el registro a sincronizar no contiene un id de usuario
                @error_count += 1
                @user_id_mapped_nil += 1
                @not_saved_array.push(r)
              else
                # check if parent_id exist
                @parent_id = @parent_id_mapped
                @updated_at = @updated_at_mapped
                @created_at = @created_at_mapped

                @form = Project.where(id: @parent_id).first
                if @form.nil? || @parent_id.nil?
                  @error_count += 1
                  @parent_id_mapped_nil += 1
                  @not_saved_array.push(r)
                else
                  @project_data_children = ProjectDataChild
                    .where(:project_field_id => params["subfield_id"])
                    .where("properties->>'"+@unique_field.to_s+"' = '" + @unique_field_mapped.to_s+ "' ")
                    .first
                  properties = {}
                  @mapping_from_api.keys().each do |m|
                    @mapping_mapped = @mapping_from_api[m]
                    properties[m] = r[@mapping_mapped]
                  end
                  properties[@unique_field] = @unique_field_mapped

                  if @project_data_children.nil?
                    # is a new record
                    @project_data_children = ProjectDataChild.new
                    if @project_data_children.create_subform_sync(properties, @parent_id, params["subfield_id"], @user_id_mapped, @created_at, @updated_at)
                      @new_count += 1
                    else
                      @error_count += 1
                      @not_saved_array.push(r)
                    end
                  else
                    # update record
                    project_data_children_properties = @project_data_children.properties
                    properties = project_data_children_properties.merge(properties)

                    if @project_data_children.project_id == @parent_id.to_i && @project_data_children.project_field_id == params["subfield_id"].to_i
                      if @project_data_children.update_subform_sync(properties, @updated_at)
                        @update_count += 1
                      else
                        @error_count += 1
                        @not_saved_array.push(r)
                      end
                    else
                      #The project_data_children to update do not belong to project_id and/or to project_field_id
                      @no_project_id_project_field_id += 1
                      @error_count += 1
                      @not_saved_array.push(r)
                    end
                  end
                end
              end
              if @error_count > @last_error_count
                @sample_point_id.push(r["PuntoMuestreal"])
              end
              @last_error_count = @error_count
            end
            @return_data[:result] ="Nuevos subformularios: #{@new_count}. Subformularios editados: #{@update_count}. Subformularios sin guardar: #{@error_count}."
            @return_data[:track_errors] = "-Registros sin campo de identificación único: #{@unique_field_mapped_nil}. -Registros sin ID del padre: #{@parent_id_mapped_nil}. -Registros sin campo update_at: #{@updated_at_mapped_nil}. -Registros sin campo created_at: #{@created_at_mapped_nil}. -Registros sin ID de usuario: #{@user_id_mapped_nil}. -No pertenecen a project_id y/o project_field_id: #{@no_project_id_project_field_id}"
            @return_data[:sample_point_ids] = "IDs de Puntos Muestreales con errores: #{@sample_point_id.join(', ')}"
          end
        end
      end
    else
      # If the response is not successful
      @return_data[:result] ="La conexión falló con el siguiente error: #{response.code}"
    end
    render json: @return_data
  end

  private

  def set_project_type
    @project_type = ProjectType.find(params[:id])
  end

  def set_api_connection
    @project_type_id = ProjectType.find(params[:id])
    @subfield_id = params[:subfield_id]
    @subfield_name = ProjectField.where(id: @subfield_id).pluck(:name).first
    if @subfield_id.nil?
      @api_connection = ApiConnection.new
      @project_fields = ProjectField.where(project_type_id: @project_type.id)
      .where("field_type_id = 7 ")
      .order(:sort)
    else
      @api_connection = ApiConnection.where(project_type_id: @project_type_id).where(subfield_id: @subfield_id).first;
      if @api_connection.nil?
        @api_connection = ApiConnection.new
      end
    end
  end

  def api_connection_params
    params.require(:api_connection).permit(:project_type_id, :url, :interval, :automatic, :token, :key_api, :subfield_id, :mapped_fields, :content_type, :authorization, :last_sync)
  end

end
