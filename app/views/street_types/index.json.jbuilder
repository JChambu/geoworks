json.array!(@street_types) do |street_type|
  json.extract! street_type, :name
  json.url street_type_url(street_type, format: :json)
end
