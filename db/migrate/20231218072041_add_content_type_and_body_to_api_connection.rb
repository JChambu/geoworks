class AddContentTypeAndBodyToApiConnection < ActiveRecord::Migration[5.1]
  def change
    add_column :api_connections, :content_type, :string
    add_column :api_connections, :body, :string
  end
end
