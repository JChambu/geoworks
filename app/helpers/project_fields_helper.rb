module ProjectFieldsHelper
  def filter_field_for_indicator_select
    @a = ProjectField.where(project_type_id: params[:project_type_id]).where(filter_field: true).select("name, id").ordered.map { |field|  [field.name, field.id] }
  end
end
