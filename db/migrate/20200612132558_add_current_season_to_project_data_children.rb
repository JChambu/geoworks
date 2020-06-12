class AddCurrentSeasonToProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :project_data_children, :current_season, :boolean, default: true
  end
end
