class AddColumnInternalObservationToPois < ActiveRecord::Migration[5.0]
  def change
    add_column :pois, :internal_observation, :string
  
  end
end
