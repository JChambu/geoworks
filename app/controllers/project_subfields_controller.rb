class ProjectSubfieldsController < ApplicationController

  def  edit_multiple
      @project_type_id = params[:project_type_id]
      @project_field_id = params[:project_field_id]
      @projectSubfields = ProjectSubfield.where(project_field_id: @project_field_id).order(:sort)
  end
 
  def update_multiple
    @project_type_id = params[:project_type_id]
    @project_field_id = params[:project_field_id]
    ProjectSubfield.update(params[:Fields].keys, params[:Fields].values)
    redirect_to edit_multiple_project_type_project_fields_path(@project_type_id)
  end

end
