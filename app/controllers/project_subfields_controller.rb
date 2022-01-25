class ProjectSubfieldsController < ApplicationController

  def index
    project_type = ProjectType.find(params[:project_type_id])
    project_field = project_type.project_fields.find(params[:project_field_id])
    if request.xhr?
      respond_to do |format|
        format.json {
          render json: { project_subfields: project_field.project_subfields }
        }
      end
    end
  end

  def  edit_multiple
      @project_type_id = params[:project_type_id]
      @project_field_id = params[:project_field_id]
      @projectSubfields = ProjectSubfield.where(project_field_id: @project_field_id).order(:sort)
  end

  def update_multiple
    @project_type_id = params[:project_type_id]
    @project_field_id = params[:project_field_id]
    ProjectSubfield.update(params[:Fields].keys, params[:Fields].values)
    redirect_to edit_multiple_project_type_project_fields_path(@project_type_id)
  end

  def show_subfields

    project_field_id = params[:element_field_id]
    child_fields = ProjectSubfield.where(project_field_id: project_field_id).order(:sort)
    child_fields_array = []

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

    render json: child_fields_array

  end

end
