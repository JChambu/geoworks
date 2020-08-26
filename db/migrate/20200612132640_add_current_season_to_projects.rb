class AddCurrentSeasonToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :current_season, :boolean, default: true
  end
end
