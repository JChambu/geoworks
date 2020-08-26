class RemoveFkFromHasProjectTypes < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:has_project_types, :users)
      remove_foreign_key :has_project_types, :users
    end
  end
end
