class AddColumnProjectTypeIdAndPropertiesToCharts < ActiveRecord::Migration[5.1]
  def change
      add_column :charts, :project_type_id, :integer
      add_column :charts, :properties, :jsonb
  
  end
end
