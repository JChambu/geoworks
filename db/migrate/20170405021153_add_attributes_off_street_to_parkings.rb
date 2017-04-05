class AddAttributesOffStreetToParkings < ActiveRecord::Migration[5.0]
  def change

    add_column :parkings, :payment, :string
    add_column :parkings, :parking_configuration, :string
    add_column :parkings, :parking_capacity, :string
    add_column :parkings, :parking_type, :string
  end
end
