Navarra.namespace("parkings");
Navarra.namespace("parkings.action_new");
Navarra.namespace("parkings.action_edit");
var map, nameEnableGeom;
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

    bindAddMarkerGeomClick();
    map.addEventListener('tap', onMapClick_parking);
    //    loadLatLonFieldsParking();

  },

    bindAddMarkerGeomClick = function(){
      $(".geom").click(function(evt){
        evt.preventDefault();
        $(this).toggleClass("btn-success");
        nameEnableGeom = this.id;
      });
    }


  onMapClick_parking = function(evt) {

    if (nameEnableGeom == 'add-polygon'){
    }else{
      coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
      addMarker(coord.lat, coord.lng)
    }
  }

  addMarker = function(lat, lng){

    switch (nameEnableGeom)
    {
      case 'add-marker-geom':

        Navarra.parkings.latitude = lat;
        Navarra.parkings.longitude = lng;
        text = "S";
        color = 'blue';
        break;

      case 'add-marker-entry':

        Navarra.parkings.latitude = lat;
        Navarra.parkings.longitude = lng;
        text = "E";
        color = 'green';
        break;
      case 'add-marker-exit':

        Navarra.parkings.latitude = lat;
        Navarra.parkings.longitude = lng;
        text = "S";
        color = 'red';
        break;
    }

    markup = markupTemplate.replace('${text}', text).replace('${FILL}', color);
    icon = new H.map.Icon(markup);

    map.setCenter({lat:lat,lng:lng});
    map.setZoom('19',true);
    var marker_sug = new H.map.Marker({lat: lat, lng: lng}, { icon: icon} )
    map.addObject(marker_sug);
    loadLatLonFieldsParking(); 
  },

    loadLatLonFieldsParking = function() {

      switch (nameEnableGeom)
      {
        case 'add-marker-geom':
          $("#parking_latitude").attr("value", Navarra.parkings.latitude);
          $("#parking_longitude").attr("value", Navarra.parkings.longitude);
          break; 
        case 'add-marker-entry':
          $("#parking_latitude_entry").attr("value", Navarra.parkings.latitude);
          $("#parking_longitude_entry").attr("value", Navarra.parkings.longitude);
          break;
        case 'add-marker-exit':
          $("#parking_latitude_exit").attr("value", Navarra.parkings.latitude);
          $("#parking_longitude_exit").attr("value", Navarra.parkings.longitude);
          break;
      }
    }


  return {
    init: init,
  }
}();



