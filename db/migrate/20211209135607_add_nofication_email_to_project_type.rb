class AddNoficationEmailToProjectType < ActiveRecord::Migration[5.1]
  def change
    add_column :project_types, :notification_email, :string
  end
end
