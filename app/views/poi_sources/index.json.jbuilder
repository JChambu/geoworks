json.array!(@poi_sources) do |poi_source|
  json.extract! poi_source, :name
  json.url poi_source_url(poi_source, format: :json)
end
