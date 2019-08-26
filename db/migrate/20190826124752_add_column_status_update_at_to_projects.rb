class AddColumnStatusUpdateAtToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :status_update_at, :datetime, default: Time.now
  end
end
