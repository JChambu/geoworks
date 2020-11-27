class SetLevelDefaultValueInProjectTypes < ActiveRecord::Migration[5.1]
  def change
    change_column :project_types, :level, :integer, default: 1
  end
end
