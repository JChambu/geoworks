module ProjectFieldsHelper
  def filter_field_for_indicator_select
    @a = ProjectField.where(project_type_id: params[:project_type_id]).where(filter_field: true).where('field_type_id!= 11 and field_type_id!= 7 ').select("name, id").ordered.map { |field|  [field.name, field.id] }
  end

  def filter_field_for_indicator_select_numeric
    @a = ProjectField.where(project_type_id: params[:project_type_id]).where(filter_field: true).where(field_type_id: 5).select("name, id").ordered.map { |field|  [field.name, field.id] }
  end

  def get_name_from_key key
    @query = ProjectField.where(project_type_id: params[:project_type_id]).where(key: key).select(:name).first
  end

end
