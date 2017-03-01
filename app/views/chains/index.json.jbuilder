json.array!(@chains) do |chain|
  json.extract! chain, :name, :identifier, :poi_type_id
  json.url chain_url(chain, format: :json)
end
