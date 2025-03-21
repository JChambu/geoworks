class ProjectStatusRulesController < ApplicationController
    def index
    @project_type_id = params[:project_type_id] || session[:project_type_id]
    @project_statuses = ProjectStatus.where(project_type_id: @project_type_id)
    @project_fields = ProjectField.where(project_type_id: @project_type_id).where.not(field_type_id: 11).order(:sort)
    @existing_rules = ProjectStatusRule.where(project_type_id: @project_type_id).index_by(&:project_status_id)
    render 'project_status_rules/index'
  end

  def jsonb_keys
    project = Project.find(params['id'].to_i)
    project_type_id = project.project_type_id
    statuses = ProjectStatus.where(project_type_id: project_type_id)
    properties = project.properties

    render json: { keys: properties.keys, project_type_id: project_type_id, statuses: statuses }
  end

  def get_saved_rules
    project_id = params[:id].to_i
    rules = ProjectStatusRule.where(project_id: project_id)
    
    saved_rules = rules.each_with_object({}) do |rule, hash|
      hash[rule.jsonb_key] = { trigger_value: rule.trigger_value, project_status_id: rule.project_status_id }
    end
  
    render json: saved_rules
  end  

  def create
    project_type_id = params[:project_type_id]
    rules = params[:rules]

    rules.each do |status_id, values|
      next if values[:trigger_value].blank?

      ProjectStatusRule.where(project_type_id: project_type_id, project_status_id: status_id).delete_all

      rule = ProjectStatusRule.new(
        project_type_id: project_type_id,
        project_status_id: status_id,
        json_key: values[:field_key],
        trigger_value: values[:trigger_value]
      )

      rule.save!
    end

    redirect_to project_status_rules_project_status_rules_path(project_type_id: project_type_id), notice: "Reglas guardadas correctamente."
  end
end
