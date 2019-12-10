class AddColumnRowActiveToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :row_active, :boolean, default: true
  end
end
