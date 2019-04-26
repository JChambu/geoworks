class AddColumnOrderFieldToProjectFields < ActiveRecord::Migration[5.1]
  def change
      add_column :project_fields, :sort, :integer
  end
end
