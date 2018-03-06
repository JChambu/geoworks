module ProjectTypesHelper

def region_for_select

  Project.where(project_type_id: params["project_type_id"]).select("properties->>'7926'").group("properties->>'7926'").each do |region| p region  
  end
    
end
end
