Navarra.namespace("parkings");
Navarra.namespace("parkings.action_new");
Navarra.namespace("parkings.action_edit");
var map;
Navarra.parkings.action_new = function(){
  var init = function(){

    platform = new H.service.Platform({
      app_id: 'ZTVBhWvg8dw4GhrG9fcL',
      app_code: 'jOEPEj4JkZvbAiv7GP0E2A',
      useCIT: true,
      useHTTPS: true
    });

    maptiler = platform.getMapTileService();
    router = platform.getRoutingService();
    enterpriseRouter = platform.getEnterpriseRoutingService();
    geocoder = platform.getGeocodingService();
    mapContainer = document.getElementById("geocoding-map");
    var defaultLayers = platform.createDefaultLayers();
    
    map = new H.Map(mapContainer, defaultLayers.normal.map, {
      zoom: 4,
      center: new H.geo.Point(-32.934929,-68.774414)
    });


    var mapEvents = new mapsjs.mapevents.MapEvents(map);
    var behavior = new mapsjs.mapevents.Behavior(mapEvents);
    var ui = new mapsjs.ui.UI(map, {
      zoom: true,
      panorama: true
    });
   
    
    
    var strip = new H.geo.Strip();
    strip.pushPoint({lat:53.3477, lng:-6.2597});
    strip.pushPoint({lat:51.5008, lng:-0.1224});
    strip.pushPoint({lat:48.8567, lng:2.3508});
    strip.pushPoint({lat:52.5166, lng:13.3833});

    map.addObject(new H.map.Polyline(
      strip, { style: { lineWidth: 10 }}
    ));

  }










  return {
    init: init
  }
}();



