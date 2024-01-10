class AddLastSyncToApiConnection < ActiveRecord::Migration[5.1]
  def change
    add_column :api_connections, :last_sync, :datetime
  end
end
