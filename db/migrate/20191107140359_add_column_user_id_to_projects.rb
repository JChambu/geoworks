class AddColumnUserIdToProjects < ActiveRecord::Migration[5.1]
  def change
    add_reference :projects, :user
  end
end
