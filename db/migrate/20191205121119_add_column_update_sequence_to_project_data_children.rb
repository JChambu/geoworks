class AddColumnUpdateSequenceToProjectDataChildren < ActiveRecord::Migration[5.1]
  def change
    add_column :project_data_children, :update_sequence, :serial
  end
end
