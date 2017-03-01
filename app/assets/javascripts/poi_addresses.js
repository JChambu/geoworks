Navarra.namespace("poi_addresses.action_new");
Navarra.namespace("poi_addresses.action_edit");
Navarra.namespace("poi_addresses.action_georeferenced");

Navarra.poi_addresses.config = {
  "lon": null,
  "lat": null,
  "originalLat": null,
  "originalLot": null,
  "otherpois" : null
};

Navarra.poi_addresses.action_new = function(){


  cities = function() { $("#poi_address_city_id").ajaxChosen({
      type: 'GET',
      url: '/locations/cities',
      dataType: 'json'

    }, function (data) {
      var results = [];

      $.each(data, function (i, val) {
        results.push({value: val.value, text: val.text});
      });
      return results;
    });
  },


  loadLatLonFields = function() {
    $(".btn-primary").click(function(e) {
      $("#poi_address_latitude").attr("value", Navarra.geocoding.latitude);
      $("#poi_address_longitude").attr("value", Navarra.geocoding.longitude);
    });
  },


  bindSuggestButtonClick = function() {
    $("#suggest-locations-btn").click(function(e) {
      e.preventDefault();
 
      if($("#poi_address_street").val() == '') {
        alert("Debe ingresar una Calle para poder sugerir ubicaciones.");
        return;
      }

      if( $("#poi_address_number").val() == '') {
        alert("Debe ingresar Número para poder sugerir ubicaciones.");
        return;
      }

      var searchTerm = $("#poi_address_street").val() + " " + $("#poi_address_number").val();


      var options = {"searchTerm": searchTerm};

      if($("#poi_city_id").val() == '') {
        alert("Debe seleccionar una ciudad para poder sugerir ubicaciones.");
        return;
      }

      var city_name =   $("#poi_address_city_name").val(); 
      var department_name =   $("#poi_address_department_name").val();
      var province_name =   $("#poi_address_province_name").val();
      var country_name =   $("#poi_address_country_name").val()

     // var location = $("#poi_address_city_id option:selected").text();
      //var locationArr = location.split(", ");

      if (city_name != "")  {
        options["location"] = city_name;
      }

      if(department_name != "") {
        options["department"] = department_name;
      }

      if (country_name != ""){
        options["country"] = province_name;
      }

      Navarra.geocoding.doGeocode(options);
    });
  },

   init = function() {
      cities();
      bindSuggestButtonClick();
      loadLatLonFields();
      Navarra.geocoding.init(
        Navarra.poi_addresses.config.lat,
        Navarra.poi_addresses.config.lon,
        Navarra.poi_addresses.config.originalLat,
        Navarra.poi_addresses.config.originalLon,
        Navarra.poi_addresses.config.otherpois
        );
  }
  return {
    init: init,
  }
}();

Navarra.poi_addresses.action_georeferenced = function(){

  markupTemplate = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px"><path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/><path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="${FILL}"/><text x="13" y="19" font-size="12pt" font-weight="bold" text-anchor="middle" fill="#fff"></text></svg>';


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
      url: '/poi_addresses/total_poi_validates',
      dataType: 'json',
      data: {},
      success:  function (data) {
        $.each(data, function (j, val) {
          st_y = val.st_y;
          st_x = val.st_x;
          markup_svg = markupTemplate.replace('${FILL}', val.color);
          icon = new H.map.Icon(markup_svg);
          var markerO = new H.map.Marker({lat:st_y, lng:st_x}, {icon: icon});
          map.addObject(markerO);
        });
      }
    });
    //    addinfo(map, defaultLayers, ui);
  };

  /*addinfo = function(map, defaultLayers, ui){

    map.addEventListener('tap', function (evt) {
    console.log(evt.target);
    var bubble =  new H.ui.InfoBubble(evt.target.getPosition(), {
  // read custom data
  content: evt.target.getData()
  });
  ui.addBubble(bubble);
  }, false);

  },*/
  return{
    init:init
      // addinfo:addinfo
  }
}();
Navarra.poi_addresses.action_edit = function(){
  var init = function() {
    Navarra.poi_addresses.action_new.init();
  }

  return {
    init: init
  }
}();

