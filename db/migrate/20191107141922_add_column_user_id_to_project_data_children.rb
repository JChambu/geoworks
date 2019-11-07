class AddColumnUserIdToProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    add_reference :project_data_children, :user
  end
end
