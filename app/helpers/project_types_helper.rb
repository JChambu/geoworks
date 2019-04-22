module ProjectTypesHelper

  def region_for_select
    ProjectField.where(project_type_id: params[:project_type_id]).select("key").map { |region|  region.key }
  end

  def kpi_for_select
    AnalyticsDashboard.where(project_type_id: params[:project_type_id], graph: true).select("id, title").map { |name_kpi|  [name_kpi.title, name_kpi.id]  }
  end
  def fields_for_select

    ProjectField.where(project_type_id: params["id"]).select("key").map { |region|    region.key
    }
  end

  def project_types_for_select
    ProjectType.all.map { |region| [region.name, region.id]   }
  end

  def user_for_projects
    @users = User.joins("LEFT OUTER JOIN has_project_type on users.id = ")
  end


end
