json.array!(@extended_listing_loads) do |extended_listing_load|
  json.extract! extended_listing_load, :name, :status, :success_count, :fail_count, :already_loaded_count, :directory_name
  json.url extended_listing_load_url(extended_listing_load, format: :json)
end
