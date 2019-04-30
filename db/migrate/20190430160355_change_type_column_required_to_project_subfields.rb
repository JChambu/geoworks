class ChangeTypeColumnRequiredToProjectSubfields < ActiveRecord::Migration[5.1]
  def change
      remove_column :project_subfields, :required
      add_column :project_subfields, :required, :boolean
  end
end
