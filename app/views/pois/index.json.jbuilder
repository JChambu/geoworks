json.array!(@pois) do |poi|
  json.extract! poi, :name, :short_name, :website, :email, :second_email, :note, :cel_number, :phone, :second_phone, :fax, :house_number, :contact, :priority, :location, :city_id, :chain_id, :food_type_id, :poi_source_id, :poi_sub_type_id, :street_name, :street_type_id, :user_id, :poi_status_id, :the_geom, :active, :deleted, :duplicated_identifier, :identifier
  json.url poi_url(poi, format: :json)
end
