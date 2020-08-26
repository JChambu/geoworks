class RemoveFkFromPermissions < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:permissions, :events)
      remove_foreign_key :permissions, :events
    end
    if foreign_key_exists?(:permissions, :model_types)
      remove_foreign_key :permissions, :model_types
    end
  end
end
