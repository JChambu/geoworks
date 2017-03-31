class AddAttributesToParkings < ActiveRecord::Migration[5.0]
  def change
    add_column :parkings, :restrinctions, :string 
    add_column :parkings, :max_drive_height, :string
    add_column :parkings, :max_drive_width, :string
    add_column :parkings, :elevators, :boolean, default: false
    add_column :parkings, :escalators, :boolean, default: false
    add_column :parkings, :handicapped_accessible, :boolean, default: false
    add_column :parkings, :handicapped_parking_spaces, :boolean, default: false
    add_column :parkings, :women_parking_spaces, :boolean, default: false
    add_column :parkings, :sanitation_facilities, :boolean, default: false
    add_column :parkings, :restroom_available, :boolean, default: false
    add_column :parkings, :secure_parking, :boolean, default: false
    add_column :parkings, :security_manned, :boolean, default: false
    add_column :parkings, :electric_vehicle_charging_points, :boolean, default: false
    add_column :parkings, :connector_type, :boolean, default: false
    add_column :parkings, :number_of_connectors, :boolean, default: false
    add_column :parkings, :charge_point_operator, :boolean, default: false
    add_column :parkings, :payment_methods, :boolean, default: false
    add_column :parkings, :light, :boolean, default: false
    add_column :parkings, :motorcycle_parking_spaces, :boolean, default: false
    add_column :parkings, :family_friendly, :boolean, default: false
    add_column :parkings, :carwash, :boolean, default: false
    add_column :parkings, :parking_disc, :boolean, default: false
    add_column :parkings, :parking_ticket, :boolean, default: false
    add_column :parkings, :gate, :boolean, default: false
    add_column :parkings, :monitored, :boolean, default: false
    add_column :parkings, :none, :boolean, default: false
    add_column :parkings, :total_space, :string
    add_column :parkings, :space_available, :string
    add_column :parkings, :available, :string
    add_column :parkings, :trend, :string
    add_column :parkings, :total_disabled_space, :string
    add_column :parkings, :available_disabled_space, :string
  
  
  end
end
