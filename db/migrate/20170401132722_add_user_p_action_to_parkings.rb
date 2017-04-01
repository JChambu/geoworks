class AddUserPActionToParkings < ActiveRecord::Migration[5.0]
  def change
      add_column :parkings, :user_id, :integer
      add_column :parkings, :p_action_id, :integer
      add_column :parkings, :poi_status_id, :integer
  end
end
