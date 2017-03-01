json.array!(@poi_addresses) do |poi_address|
  json.extract! poi_address, :city_id,, :street,, :number,, :neighborhood,, :block,, :house
  json.url poi_address_url(poi_address, format: :json)
end
