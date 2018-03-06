json.array! @projects do |item|
  json.latitude item['st_y']
  json.longitude item['st_x']
  json.status item['status']
  json.client_id item['client_id']
  json.razon_social item['razon_social']
  json.ejecutivo item['ejecutivo']
end



#funciona bien
#json.array! @projects do |item|
#  json.latitude item['properties']['latitude']
#  json.longitude item['properties']['longitude']
#end
