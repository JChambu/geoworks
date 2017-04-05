class AddMaxDurationToParkings < ActiveRecord::Migration[5.0]
  def change
      add_column :parkings, :max_duration_parking_disc, :string
  end
end
