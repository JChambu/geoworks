json.array!(@poi_sub_types) do |poi_sub_type|
  json.extract! poi_sub_type, :name, :poi_type_id
  json.url poi_sub_type_url(poi_sub_type, format: :json)
end
