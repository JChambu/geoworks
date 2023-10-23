class AddColumnsToApiConnection < ActiveRecord::Migration[5.1]
  def change
    add_column :api_connections, :token, :string
    add_column :api_connections, :key_api, :string
  end
end
