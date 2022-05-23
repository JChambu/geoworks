class ProjectFieldsController < ApplicationController

  before_action :set_project_field, only: [:show, :edit, :update, :destroy, :geocoding]
  def index
      @project_type_id = params[:project_type_id]
      @project_fields = ProjectField.where(project_type_id: @project_type_id).order(:sort)

  end

  def new
    @project_field = ProjectField.new
    @project_subfield = @project_field.project_subfields.build
  end

  def show_fields

    project_type_id = params[:project_type_id]

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

    # Busca los campos del padre
    father_fields = ProjectField.where(project_type_id: project_type_id).order(:sort)

    father_fields_array = []

    father_fields.each do |f_field|

      # Si el rol del usuario está seleccionado o sino hay ningún rol seteado, se puede ver
      roles_read = (JSON.parse(f_field.roles_read)).reject(&:blank?)
      if roles_read.include?(@user_rol.to_s) || roles_read.blank?
        f_can_read = true
      else
        f_can_read = false
      end

      # Si el rol del usuario está seleccionado o sino hay ningún rol seteado, se puede editar
      roles_edit = (JSON.parse(f_field.roles_edit)).reject(&:blank?)
      if roles_edit.include?(@user_rol.to_s) || roles_edit.blank?
        f_can_edit = true
      else
        f_can_edit = false
      end

      # Si el tipo de campo es listado (simple, múltiple o anidado) arma un array con los otros valores posibles
      if f_field.field_type_id == 10 || f_field.field_type_id == 2

        id = f_field.choice_list_id

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

      father_field_hash = {}
      father_field_hash['field_id'] = f_field.id
      father_field_hash['name'] = f_field.name
      father_field_hash['field_type_id'] = f_field.field_type_id
      father_field_hash['other_possible_values'] = other_possible_values if f_field.field_type_id == 10 || f_field.field_type_id == 2
      father_field_hash['required'] = f_field.required
      father_field_hash['read_only'] = f_field.read_only
      father_field_hash['can_read'] = f_can_read
      father_field_hash['can_edit'] = f_can_edit
      father_field_hash['hidden'] = f_field.hidden
      father_field_hash['data_script'] = f_field.data_script
      father_field_hash['calculated_field'] = f_field.calculated_field
      father_field_hash['key'] = f_field.key
      father_fields_array.push(father_field_hash)

    end

    data = {
      father_fields: father_fields_array,
    }

    render json: data

  end

  def create
  		@analytics_dashboard = AnalyticsDashboard.new

  		@analytics_dashboard['title'] = params['title']
  		@analytics_dashboard.save
  end

  def edit
      @project_fields = ProjectField.where(project_type_id: @project_type_id).order(:sort)
  end
  def show
      @projectFields = ProjectField.where(project_type_id: params[:id])
  end


  def  edit_multiple
      @project_type_id = params[:project_type_id]
      @projectFields = ProjectField.where(project_type_id: @project_type_id).order(:sort)
  end

  def update_multiple
  @project_type_id = params[:project_type_id]
    ProjectField.update(params[:Fields].keys, params[:Fields].values)
    redirect_to project_type_project_fields_path(@project_type_id)
  end

  def field_popup
    project_name = params[:project_name]
    @fields = ProjectField
          .select('DISTINCT main.*')
          .from('project_fields main INNER JOIN project_types sec ON sec.id = main.project_type_id')
          .where('main.popup = ?', true)
          .where('sec.name_layer = ?', project_name)
          .order('sort')
    @name = ProjectType.where(name_layer: params[:project_name]).pluck(:name)

    fields_json = {}
    @fields.each do |field|
      fields_json[field.key] = field.name
    end
    data = {}
    data['project_name'] = @name
    data['fields_popup'] = fields_json

    render json: data
  end

  def get_project_field_layer
    name_layer = params[:name_layer]
    data = ProjectField
      .select('DISTINCT main.name , main.key , main.sort , main.field_type_id')
      .from('project_fields main INNER JOIN project_types sec ON sec.id = main.project_type_id')
      .where('main.filter_field = ?', true)
      .where('sec.name_layer = ?', name_layer)
      .order('sort')
    render json: data
  end

  def get_filter_operator
    data = ProjectType::FILTERS
    render json: data
  end

  def get_filter_values
    data = ProjectType::FILTERS
    render json: data
  end

  def set_project_field
    @project_field = ProjectField.find(params[:id])
    @project_subfields = @project_field.project_subfields.order(:sort)
  end

  def get_field_type
    key = params[:key]
    project_type_id = params[:project_type_id]
    data = ProjectField.where(project_type_id: project_type_id).where(key: key).pluck(:field_type_id).first
    render json: data
  end

  def project_field_params
    params.require(:project_field).permit(:id,  project_subfields_attributes: [:id, :field_type_id, :name, :required, :cleasing_data, :georeferenced, :regexp_type_id, :sort])
  end


end
