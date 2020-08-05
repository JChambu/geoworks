class RemoveFkFromPermissions < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :permissions, :events
    remove_foreign_key :permissions, :model_types
  end
end
