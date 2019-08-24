class AddColumnProjectStatusIdToProjects < ActiveRecord::Migration[5.1]
  def change
    add_reference :projects, :project_status, foreign_key: true
  end
end
