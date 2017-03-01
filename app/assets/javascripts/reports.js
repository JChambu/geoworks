Navarra.namespace("reports.action_pois");
Navarra.namespace("reports.action_users");
Navarra.namespace("reports.action_poi_verification");
Navarra.namespace("reports.action_poi_verification_maps");


Navarra.reports.action_pois = function() {
  var init = function() {
    Navarra.poi_search_panel.init();
  }

  return {
    init: init
  }
}();

Navarra.reports.action_users = function() {
  var init = function() {
    Navarra.poi_search_panel.init();
  }

  return {
    init: init
  }
}();

Navarra.reports.action_poi_verification = function(){

  var init = function () {
    $("#check_all").on("click", function(){
    
       var chk =  $('input[type="checkbox"]');
       
       console.log(chk.prop("checked"));
       
       
       if (chk.prop("checked")){
        console.log("colocar tilde");
       chk.prop("checked", true);
       }else
       {
        console.log("sacar tilde");
         chk.prop("checked", false);
       }
    
    });
  }    
  return{
    init: init
  }
}();
Navarra.reports.action_poi_verification_maps = function(){
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
    $.ajax({
      type: 'GET',
      url: '/pois/total_poi_validates',
      dataType: 'json',
      data: {},
      success:  function (data) {
      $.each(data, function (j, val) {
            st_y = val.st_y;
            st_x = val.st_x;
            console.log("go");
              var markerO = new H.map.Marker({lat:st_y, lng:st_x});
              map.addObject(markerO);
      });
      }
  });
  }
  return{
    init:init
  }
}();


