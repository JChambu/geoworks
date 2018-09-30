module ProjectTypesHelper

  def region_for_select
    ProjectField.where(project_type_id: project_type_id).select("key").map { |region|  region.key }
  end
  
  def fields_for_select
    ProjectField.where(project_type_id: params["id"]).select("key").map { |region|    region.key
    }
  end

  def project_types_for_select
    ProjectType.all.map { |region| [region.name, region.id]   }
end
end
