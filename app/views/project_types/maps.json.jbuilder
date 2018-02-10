json.array! @projects do |item|
  json.latitude item['st_y']
  json.longitude item['st_x']
end



#funciona bien
#json.array! @projects do |item|
#  json.latitude item['properties']['latitude']
#  json.longitude item['properties']['longitude']
#end
