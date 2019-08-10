class AddColumnSyncronizationDataToProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :syncronization_data, :boolean, default: true
  end
end
