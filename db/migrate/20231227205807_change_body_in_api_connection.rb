class ChangeBodyInApiConnection < ActiveRecord::Migration[5.1]
  def change
    rename_column :api_connections, :body, :authorization
  end
end
