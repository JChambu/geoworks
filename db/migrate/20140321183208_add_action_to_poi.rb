class AddActionToPoi < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :p_action_id, :integer
  end
end
