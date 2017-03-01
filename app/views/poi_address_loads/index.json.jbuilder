json.array!(@poi_address_loads) do |poi_address_load|
  json.extract! poi_address_load, :name, :status, :directory_name
  json.url poi_address_load_url(poi_address_load, format: :json)
end
