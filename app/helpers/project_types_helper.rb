module ProjectTypesHelper

  def region_for_select
    ProjectField.where(project_type_id: params["project_type_id"]).select("key").map { |region|  region.key
    }
  end
end
