class AddFilterFieldToProjectSubfields < ActiveRecord::Migration[5.1]
  def change
    add_column :project_subfields, :filter_field, :boolean, default: false
  end
end
