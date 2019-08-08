class AddColumnTypeGeometryProjectTypes < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :type_geometry, :string
  end
end
