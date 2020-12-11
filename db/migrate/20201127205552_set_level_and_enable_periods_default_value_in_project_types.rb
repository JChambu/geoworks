class SetLevelAndEnablePeriodsDefaultValueInProjectTypes < ActiveRecord::Migration[5.1]
  def change
    change_column :project_types, :level, :integer, default: 1
    ProjectType.where(level: nil).update_all(level: 1)
    change_column :project_types, :enable_period, :string, :default => "Nunca"
    ProjectType.where(enable_period: nil).update_all(enable_period: "Nunca")
  end
end
