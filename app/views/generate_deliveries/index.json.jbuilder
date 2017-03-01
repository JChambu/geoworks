json.array!(@generate_deliveries) do |generate_delivery|
  json.extract! generate_delivery, :name, :country_id
  json.url generate_delivery_url(generate_delivery, format: :json)
end
