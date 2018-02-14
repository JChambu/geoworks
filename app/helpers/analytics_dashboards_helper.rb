module AnalyticsDashboardsHelper

  def fields_for_select
    ProjectField.where(project_type_id: @project_type.id).map {|field| [field.name, field.id]}

  end

  def analysis_types_for_select
    AnalysisType.all.map {|type| [type.name, type.id]}

  end
end
