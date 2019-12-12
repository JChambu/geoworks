class AddColumnUpdateSequenceToProjects < ActiveRecord::Migration[5.1]
  
  def change
    add_column :projects, :update_sequence, :serial
  end

end
