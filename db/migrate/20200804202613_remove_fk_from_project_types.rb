class RemoveFkFromProjectTypes < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :project_types, :users
  end
end
