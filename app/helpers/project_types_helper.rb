module ProjectTypesHelper

  def role_selected role
    @role = JSON.parse(role) if !role.nil?
  end

  def region_for_select
   @a = ProjectField.where(project_type_id: params[:project_type_id]).select("key").map { |region|  region.key }
  end

  
  def heatmap_field_for_select
    @a = ProjectField.where(project_type_id: params[:project_type_id]).where(heatmap_field: true).select("key, name").ordered.map { |region|  [region.name, region.key] }
  end

  def interpolation_field_for_select
    @b = ProjectField.where(project_type_id: params[:project_type_id]).where(field_type_id: 5).where.not(key: ["app_id","app_estado","app_usuario"]).select("key, name").ordered.map { |v|  [v.name, v.key] }
    @c = ProjectSubfield
      .select(:id, :name)
      .joins(:project_field)
      .where(project_fields: {project_type_id: params[:project_type_id]})
      .where(field_type_id: 5)
      .map { |sf| [sf.name, sf.id] }
    @a = @b + @c
  end

  def color_by_range_field_for_select
    @b = ProjectField.where(project_type_id: params[:project_type_id]).where(field_type_id: 5).where.not(key: ["app_id","app_estado","app_usuario"]).select("key, name").ordered.map { |v|  [v.name, v.key] }
    @c = ProjectSubfield
      .select(:id, :name)
      .joins(:project_field)
      .where(project_fields: {project_type_id: params[:project_type_id]})
      .where(field_type_id: 5)
      .map { |sf| [sf.name, sf.id] }
    @a = @b + @c
  end

  def color_by_attribute_field_for_select
    @b = ProjectField.where(project_type_id: params[:project_type_id]).where(heatmap_field: true).where.not(key: ["app_id","app_estado","app_usuario"]).select("key, name").ordered.map { |v|  [v.name, v.key] }
    @a = @b
  end

  def colored_points_field_for_select
    @a = ProjectField.where(project_type_id: params[:project_type_id]).where(colored_points_field: true).select("key, name").ordered.map { |f|  [f.name, f.key] }
  end

  # Devuelve los campos padres e hijos que se van a utilizar en el select
  def filter_field_for_select

    fields = ProjectField
      .select(:name, :key)
      .where(project_type_id: params[:project_type_id])
      .where(filter_field: true)
      .ordered
      .map { |f| [f.name, f.key] }

    subfields = ProjectSubfield
      .select(:name, :id)
      .joins(:project_field)
      .where(project_fields: {project_type_id: params[:project_type_id]})
      .where(filter_field: true)
      .map { |sf| [sf.name, sf.id] }

    grouped_options = {'Formularios' => fields, 'Subformularios' => subfields}
  end
  
  def kpi_for_select
    AnalyticsDashboard.where(project_type_id: params[:project_type_id], graph: true).select("id, title").ordered.map { |name_kpi|  [name_kpi.title, name_kpi.id]  }
  end
  def fields_for_select
    ProjectField.where(project_type_id: params["id"]).select("key").map { |region| region.key }
  end

  def project_types_for_select
    ProjectType.all.map { |region| [region.name, region.id]   }
  end

  def project_types_for_layout
     ProjectType.joins(:has_project_types).where(has_project_types: {user_id: current_user.id}).ordered
  end


  def user_for_projects
    @users = User.joins("LEFT OUTER JOIN has_project_type on users.id = ")
  end

  def project_name
    ProjectType.find(params[:project_type_id]) 
  end

end
