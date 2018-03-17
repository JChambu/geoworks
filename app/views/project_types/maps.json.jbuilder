json.array! @projects do |item|
  json.latitude item['st_y']
  json.longitude item['st_x']
  json.status item['label']
  json.client_id item['client_id']
  json.razon_social item['razon_social']
  json.ejecutivo item['ejecutivo']
  json.contratos item['contratos']
  json.color item['color']
end



#funciona bien
#json.array! @projects do |item|
#  json.latitude item['properties']['latitude']
#  json.longitude item['properties']['longitude']
#end
