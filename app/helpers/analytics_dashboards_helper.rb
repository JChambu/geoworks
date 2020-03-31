module AnalyticsDashboardsHelper

  def fields_for_select_a
    ProjectField.where(project_type_id: params["project_type_id"]).map {|field| [field.name, field.id]}
  end

  def analysis_types_for_select
    AnalysisType.all.map {|type| [type.name, type.id]}
  end

  def get_name_kpi id
    @query = AnalyticsDashboard.where(id: id).first
  end
end
