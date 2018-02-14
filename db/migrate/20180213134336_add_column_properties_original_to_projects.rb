class AddColumnPropertiesOriginalToProjects < ActiveRecord::Migration[5.0]
  def change
      add_column :projects, :properties_original, :jsonb
  end
end
