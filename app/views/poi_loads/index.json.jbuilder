json.array!(@poi_loads) do |poi_load|
  json.extract! poi_load, :name, :load_date, :status
  json.url poi_load_url(poi_load, format: :json)
end
