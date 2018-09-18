json.array! @projects do |item|
  json.latitude item.y
  json.longitude item.x
end
