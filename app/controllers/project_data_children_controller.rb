class ProjectDataChildrenController < ApplicationController
  before_action :set_project, only: [:index]
  before_action :set_project_data_child, only: [:show, :edit, :update, :destroy]


  # GET /project_data_children
  # GET /project_data_children.json
  def index
      @project_data_children = @project.project_data_child.where(project_id:params[:project_id])
      @sub_fields = ProjectSubfield.where(project_field_id: params[:project_field_id]).order(:id)
      @title = ProjectField.find(params[:project_field_id])
  end

  # GET /project_data_children/1
  # GET /project_data_children/1.json
  def show
  end

  # GET /project_data_children/new
  def new
    @project_type = current_user.project_types.find(params[:project_type_id])
    @project_data_child = ProjectDataChild.new
    @project_data_children_no_valid = []
  end

  # GET /project_data_children/1/edit
  def edit
  end

  def show_children

    project_ids = params[:project_ids]
    project_field_ids = params[:project_field_ids]
    @respuesta_array = []
    from_date_subforms = params[:from_date_subforms]
    to_date_subforms = params[:to_date_subforms]
    filter_children = params[:filter_children]
    filter_user_children = params[:filter_user_children]

    # Busca el rol del usuario
    customer_name = Apartment::Tenant.current
    Apartment::Tenant.switch 'public' do
      customer_id = Customer.where(subdomain: customer_name).pluck(:id)
      @user_rol = UserCustomer
        .where(user_id: current_user.id)
        .where(customer_id: customer_id)
        .pluck(:role_id)
        .first
    end

    project_field_ids.each do |pfid|

      father_field = ProjectField.where(id: pfid).pluck(:name).first


      # head
      # # # # # # # # # # # # # #

      child_fields = ProjectSubfield.where(project_field_id: pfid).order(:sort)
      child_fields_array = []

      child_fields.each do |c_field|

        # Si el rol del usuario está dentro de los roles que pueden ver el campo (o no hay ningún rol configurado), el campo se agrega al json
        roles_read = (JSON.parse(c_field.roles_read)).reject(&:blank?)
        if roles_read.include?(@user_rol.to_s) || roles_read.blank?
          c_can_read = true
        else
          c_can_read = false
        end

        # Si el rol del usuario está seleccionado o sino hay ningún rol seteado, se puede editar
        roles_edit = (JSON.parse(c_field.roles_edit)).reject(&:blank?)
        if roles_edit.include?(@user_rol.to_s) || roles_edit.blank?
          c_can_edit = true
        else
          c_can_edit = false
        end

        if c_field.field_type_id == 10 || c_field.field_type_id == 2

          id = c_field.choice_list_id

          other_possible_values = []
          choice_list = ChoiceList.find(id)
          choice_list_item  = ChoiceListItem.where(choice_list_id: choice_list.id)
          sorted_choice_list_items = choice_list_item.sort { |x, y| x[:name] <=> y[:name] } # Ordena los items

          # Arma el objeto
          sorted_choice_list_items.each do |row|

            # Si tiene listados anidados, los agrega
            if !row.nested_list_id.nil?

              @nested_items = []
              nested_choice_list = ChoiceList.find(row.nested_list_id)
              nested_choice_list_item  = ChoiceListItem.where(choice_list_id: nested_choice_list.id)
              nested_sorted_choice_list_items = nested_choice_list_item.sort { |x, y| x[:name] <=> y[:name] } # Ordena los items anidados
              nested_sorted_choice_list_items.each do |f|
                @nested_items << { "id": f.id, "name": f.name }
              end
              other_possible_values << { "id": row.id, "name": row.name, "nested_items": @nested_items }
            else
              other_possible_values << { "id": row.id, "name": row.name }
            end

          end

        end

        c_data_hash = {}
        c_data_hash['field_id'] = c_field.id
        c_data_hash['name'] = c_field.name
        c_data_hash['other_possible_values'] = other_possible_values if c_field.field_type_id == 10 || c_field.field_type_id == 2
        c_data_hash['field_type_id'] = c_field.field_type_id
        c_data_hash['required'] = c_field.required
        c_data_hash['read_only'] = c_field.read_only
        c_data_hash['can_read'] = c_can_read
        c_data_hash['can_edit'] = c_can_edit
        c_data_hash['hidden'] = c_field.hidden
        c_data_hash['data_script'] = c_field.data_script
        c_data_hash['calculated_field'] = c_field.calculated_field

        child_fields_array.push(c_data_hash)

      end

      # body
      # # # # # # # # # # # # # #

      data = ProjectDataChild
        .select(:id, :properties, :project_id, :project_field_id, :gwm_created_at, 'users.name AS username')
        .joins('INNER JOIN public.users ON users.id = project_data_children.user_id')
        .where(:project_id => project_ids)
        .where(project_field_id: pfid)
        .where(row_active: true)
        .where(current_season: true)
        .order(created_at: :desc)

      # Aplica time_slider para hijos
      unless from_date_subforms.blank? || to_date_subforms.blank?
        data = data.where("gwm_created_at BETWEEN '#{from_date_subforms}' AND '#{to_date_subforms}'")
      else
        data = data.where(row_enabled: true)
      end

      # Aplica filtros de hijos
      if !filter_children.blank?
        filter_children.each do |filter_child|
          filter_parts = filter_child.split('|')
          data = data.where("properties ->> '"+filter_parts[0]+"' "+filter_parts[1]+" '"+filter_parts[2]+"'")
        end
      end

      # Aplica filtros de usuario de hijos
      if !filter_user_children.blank?
        filter_user_children.each do |filter_child|
          data = data.where("user_id = "+filter_child)
        end
      end

      # Agrupa los hijos por padre
      grouped_data = data.group_by { |c| c.project_id }

      respuesta_hash = {
        project_field_name: father_field,
        project_field_id: pfid.to_i,
        head: child_fields_array,
        body: grouped_data
      }

      @respuesta_array << respuesta_hash

    end

    render json: @respuesta_array

  end

  # POST /project_data_children
  # POST /project_data_children.json
  def create
    @project_data_child = ProjectDataChild.new(project_data_child_params)

    respond_to do |format|
      if @project_data_child.save
        format.html { redirect_to @project_data_child, notice: 'Project data child was successfully created.' }
        format.json { render :show, status: :created, location: @project_data_child }
      else
        format.html { render :new }
        format.json { render json: @project_data_child.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /project_data_children/1
  # PATCH/PUT /project_data_children/1.json
  def update
    respond_to do |format|
      if @project_data_child.update(project_data_child_params)
        format.html { redirect_to @project_data_child, notice: 'Project data child was successfully updated.' }
        format.json { render :show, status: :ok, location: @project_data_child }
      else
        format.html { render :edit }
        format.json { render json: @project_data_child.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /project_data_children/1
  # DELETE /project_data_children/1.json
  def destroy
    @project_data_child.destroy
    respond_to do |format|
      format.html { redirect_to project_data_children_url, notice: 'Project data child was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def import
    @project_type = current_user.project_types.find(params[:project_type_id])

    @project_data_children_no_valid = []

    is_from_file = params[:file].present?
    is_from_form = params[:data_children].present?

    if !is_from_file && !is_from_form
      flash.now[:alert] = "Archivo es requerido"
      render action: :new
      return
    end

    begin
      if is_from_file
        file = File.read(params[:file].path)
        data_hash = JSON.parse(file)
      elsif is_from_form
        data_hash = params[:data_children]
      end

      @project_data_children = ProjectDataChildrenImport.new
      @project_data_children.project_type = @project_type
      @project_data_children.entries = data_hash
      @project_data_children_no_valid = @project_data_children.save

      if @project_data_children_no_valid.length == 0
        message = is_from_file ? "Se procesaron #{@project_data_children.entries.length} registros correctamente" : "Se han cargado los registros exitosamente"
        redirect_to new_project_type_data_children_path(@project_type), flash: { notice: message }
      else
        flash.now[:alert] = "Se encontraron #{@project_data_children_no_valid.length} registros sin procesar"
        @project_data_children_no_valid.each do |project_data_child_no_valid|
          p project_data_child_no_valid.errors.messages
        end
        render action: :new
        return
      end
    rescue => e
      flash.now[:alert] = "Archivo seleccionado no tiene el formato JSON"
      render action: :new
      return
    end
  end

  private
    def set_project
      @project = Project.find(params[:project_id])
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_project_data_child
      @project_data_child = ProjectDataChild.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def project_data_child_params
      params.require(:project_data_child).permit(:properties, :project_id, :project_field_id)
    end
end
