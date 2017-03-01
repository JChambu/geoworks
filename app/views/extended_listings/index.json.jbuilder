json.array!(@extended_listings) do |extended_listing|
  json.extract! extended_listing, :name, :street, :the_geom, :city_id, :user_id, :category_id
  json.url extended_listing_url(extended_listing, format: :json)
end
