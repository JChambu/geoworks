class RemoveFkFromProjectFilters < ActiveRecord::Migration[5.1]
  def change
    if foreign_key_exists?(:project_filters, :users)
      remove_foreign_key :project_filters, :users
    end
  end
end
