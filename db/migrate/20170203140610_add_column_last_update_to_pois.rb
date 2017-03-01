class AddColumnLastUpdateToPois < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :last_update, :date
  
  end
end
