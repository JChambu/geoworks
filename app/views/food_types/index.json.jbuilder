json.array!(@food_types) do |food_type|
  json.extract! food_type, :name, :poi_type_id
  json.url food_type_url(food_type, format: :json)
end
