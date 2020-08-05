class RemoveFkFromProjectTypes < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:project_types, :users)
      remove_foreign_key :project_types, :users
    end
  end
end
