class AddNewColumnsToApiConnection < ActiveRecord::Migration[5.1]
  def change
    add_column :api_connections, :subfield_id, :bigint
    add_column :api_connections, :mapped_fields, :jsonb
  end
end
