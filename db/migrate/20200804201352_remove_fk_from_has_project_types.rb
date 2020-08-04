class RemoveFkFromHasProjectTypes < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :has_project_types, :users
  end
end
