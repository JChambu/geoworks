json.array!(@poi_types) do |poi_type|
  json.extract! poi_type, :name
  json.url poi_type_url(poi_type, format: :json)
end
