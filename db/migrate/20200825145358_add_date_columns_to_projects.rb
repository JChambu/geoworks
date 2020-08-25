class AddDateColumnsToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :gwm_created_at, :datetime
    add_column :projects, :gwm_updated_at, :datetime
  end
end
