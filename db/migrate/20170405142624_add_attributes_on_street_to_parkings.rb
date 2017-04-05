class AddAttributesOnStreetToParkings < ActiveRecord::Migration[5.0]
  def change
    add_column :parkings, :machine_readable, :boolean
    add_column :parkings, :maximum_duration, :string
    add_column :parkings, :tow_away_zone, :boolean
    add_column :parkings, :street_sweeping, :boolean
    add_column :parkings, :street_mall_time_market, :boolean
    add_column :parkings, :pedestrian_zone_time, :boolean
    add_column :parkings, :snow_route, :boolean
    add_column :parkings, :clearway, :boolean
    add_column :parkings, :residential, :boolean
    add_column :parkings, :handicapped, :boolean
    add_column :parkings, :diplomatic, :boolean
    add_column :parkings, :media_press, :boolean
    add_column :parkings, :other, :boolean
    add_column :parkings, :loading_unloading_zone, :boolean
    add_column :parkings, :drop_pick_up_zona, :boolean
    add_column :parkings, :disabled_handicap_only, :boolean
    add_column :parkings, :private_parking, :boolean
    add_column :parkings, :commercial_vehicles_only, :boolean
    add_column :parkings, :side_street, :string
  
  end
end
