Navarra.namespace("parkings");
Navarra.namespace("parkings.action_new");
Navarra.namespace("parkings.action_edit");
var map, nameEnableGeom, polystrip, polygon  , polygon_area, geocoder, polygon_original;

Navarra.parkings.config = {
  "lat": null,
  "lat_entry": null,
  "lat_exit": null,
  "lng": null,
  "lng_entry": null,
  "lng_exit": null,
  "polygon" : [] 
};
Navarra.parkings.action_edit = function(){
  
  var init = function(){
      Navarra.parkings.action_new.init();

   if (Navarra.parkings.config.lat){
        text = "S";
        color = 'blue';
        addMarkerEdit(Navarra.parkings.config.lat, Navarra.parkings.config.lng, text, color);
   }

   if (Navarra.parkings.config.lat_exit){
        text = "S";
        color = 'red';
        addMarkerEdit(Navarra.parkings.config.lat_entry, Navarra.parkings.config.lng_entry, text, color);
   }
   if (Navarra.parkings.config.lat_entry){
        text = "S";
        color = 'green';
        addMarkerEdit(Navarra.parkings.config.lat_exit, Navarra.parkings.config.lng_exit, text, color);
   }
    
   if (Navarra.parkings.config.polygon){

        addPolygon(Navarra.parkings.config.polygon);
  
  }
  }

  addMarkerEdit = function(lat, lng, text, color){
    markup = markupTemplate.replace('${text}', text).replace('${FILL}', color);
    icon = new H.map.Icon(markup);
    map.setCenter({lat:lat,lng:lng});
    map.setZoom('19',true);
    var marker_sug = new H.map.Marker({lat: lat, lng: lng}, { icon: icon} )
    map.addObject(marker_sug);
}
 
  



addPolygon = function(polygon_edit){

  
    polystrip = new H.geo.Strip();
      polygon_edit.forEach(function(point){
          polystrip.pushPoint(point);
      });
   

  console.log(polystrip.getPointCount());

  if (polystrip.getPointCount() == 2 ){
  
    polyline = new H.map.Polyline(
      polystrip, {
        style: {
          strokeColor: "#f00",
          lineWidth: 1
        }
      }
    );
    map.addObject(polyline);
  }else{
      
        polygon = new H.map.Polygon(
      polystrip, {
        style: {
          strokeColor: "#f00",
          lineWidth: 1
        }
      }
    );
    map.addObject(polygon);
  };
}
return {
  init: init
}
}();


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

    /*var strip = new H.geo.Strip();
    strip.pushPoint({lat:53.3477, lng:-6.2597});
    strip.pushPoint({lat:51.5008, lng:-0.1224});
    strip.pushPoint({lat:48.8567, lng:2.3508});
    strip.pushPoint({lat:52.5166, lng:13.3833});

    map.addObject(new H.map.Polyline(
      strip, { style: { lineWidth: 10 }}
    ));*/

    polygon = null, paintReady = true;
    polystrip = new H.geo.Strip();
    paintReady = true;
    cities_parkings();
    bindButtonClick();
    bindAddMarkerGeomClick();
    bindInputFocusOutParking();
  },


   bindInputFocusOutParking = function() {
    $("input").focusout(function(e) {
      f = $(this).closest("form").serialize();
      $.getScript('/parkings/possible_duplicates.js?' + f);
    });    
  };


    cities_parkings = function() { $("#parking_city_id").ajaxChosen({
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

    bindButtonClick = function() {
      $("#suggest-locations").click(function(e) {
        console.log("click");
        e.preventDefault();

        if($("#parking_street").val() == '') {
          alert("Debe ingresar una Calle para poder sugerir ubicaciones.");
          return;
        }

        if($("#parking_number").val() == '') {
          alert("Debe ingresar Número para poder sugerir ubicaciones.");
          return;
        }


        var searchTerm = $("#parking_street").val() + " " + $("#parking_number").val();

        var options = {"searchTerm": searchTerm};

        if($("#parking_city_id").val() == '') {
          alert("Debe seleccionar una ciudad para poder sugerir ubicaciones.");
          return;
        }

        var location = $("#parking_city_id option:selected").text();
        var locationArr = location.split(", ");

        if(locationArr[0] != undefined) {
          options["location"] = locationArr[0];
        }

        if(locationArr[1] != undefined) {
          options["county"] = locationArr[2];
        }

        if(locationArr[3] != undefined) {
          options["country"] = locationArr[3];
        }


        doGeocode(options);
      });
    },

    doGeocode = function(options){

      var address = options.searchTerm;

      if(options["location"] != null) {

        if(options["county"] != null && options["location"] == "Capital") {
          address += ", " + options["county"];

        } else {
          address += ", " + options["location"];  
        }      
      }


      if(options["county"] != null) {
        address += ", " + options["county"];
      }

      options.searchTerm = address
      parameters = {
        searchtext: address,
        gen: '8'
      };
      georef = geocoder.geocode(parameters,onResult,function(e){});
      return;
    }

  onResult = function(result){

    var lat, lng;

    var locations = result.Response.View[0].Result,
      position,
      marker;

    for (i = 0;  i < locations.length; i++) {
      lat =  locations[i].Location.DisplayPosition.Latitude;
      lng =  locations[i].Location.DisplayPosition.Longitude;

      position = {
        lat: lat,
        lng: lng      };



      map.setCenter(position);
      map.setZoom(19, true);
      markup_original = markupTemplate.replace('${text}', i).replace('${FILL}', '#18d');
      icon_original = new H.map.Icon(markup_original);
      marker = new H.map.Marker(position, {icon: icon_original});
      map.addObject(marker);
    }
  }

  bindAddMarkerGeomClick = function(){
    $(".geom").click(function(evt){
      evt.preventDefault();
      $(this).toggleClass("btn-success");
      nameEnableGeom = this.id;

      console.log(nameEnableGeom);
      draw_polygon_and_point();
    });
  }

  draw_polygon_and_point = function(){
    if (nameEnableGeom == 'clear'){
      polygon_area = [];
      polygon_original = [];
      paintReady = true;

      if (polygon ){
        map.removeObject(polygon);
        paintReady = true;

      }
      map.addEventListener("pointerdown", push_point_array);
      map.addEventListener("pointermove", point_move);
      map.addEventListener("dbltap", event_stop);
    }
    else{
      paintReady = false;
      map.addEventListener('tap', onMapClick_parking);
    }
  }


  remove_marker = function(lat, lng){

    if (lat){
      searchMarker = new H.map.DomMarker({lat:lat, lng:lng});
      console.log(lat, lng);

      map.removeObject(searchMarker);
    }
    return;
  }

  onMapClick_parking = function(evt) {

    coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    addMarker(coord.lat, coord.lng)
  }

  addMarker = function(lat, lng){

    switch (nameEnableGeom)
    {
      case 'add-marker-geom':
        //remove_marker(Navarra.parkings.latitude, Navarra.parkings.longitude);
        Navarra.parkings.latitude = lat;
        Navarra.parkings.longitude = lng;
        text = "S";
        color = 'blue';
        break;

      case 'add-marker-entry':

        Navarra.parkings.latitude_entry = lat;
        Navarra.parkings.longitude_entry = lng;
        text = "E";
        color = 'green';
        break;
      case 'add-marker-exit':

        Navarra.parkings.latitude_exit = lat;
        Navarra.parkings.longitude_exit = lng;
        text = "S";
        color = 'red';
        break;
      default:
        return;
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
          $("#parking_latitude_entry").attr("value", Navarra.parkings.latitude_entry);
          $("#parking_longitude_entry").attr("value", Navarra.parkings.longitude_entry);
          break;
        case 'add-marker-exit':
          $("#parking_latitude_exit").attr("value", Navarra.parkings.latitude_exit);
          $("#parking_longitude_exit").attr("value", Navarra.parkings.longitude_exit);
          break;
      }
    }

  push_point_array = function(e){
    if(paintReady)
    {
      //push a point into array
      polystrip.pushPoint(map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY));
      coord =  map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
      //create a polygon if points array has one point inside.
     
      polygon_original.push("{lat:" + coord.lat + ", lng: " + coord.lng + "}" );
     
      coordinate = (coord.lng + " " +  coord.lat)
      polygon_area.push(coordinate); 


      if(polystrip.getPointCount() == 3) {
        pushPolygon();
      }
      else if(polystrip.getPointCount() == 2){
        pushPolyline();
      }
    }
  };

  point_move = function(e){


    if(paintReady)
    {
      // update polygon shape by pointermove event
      if (polystrip.getPointCount() > 2) updatePolygon(map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY));
    }
  };

  event_stop = function(e){

    if(paintReady)
    {
      //stop event propagation
      e.originalEvent.stopImmediatePropagation();
      //set path and fillColor of polygon to finish the digitizer
      polygon.setStrip(polystrip);
      polygon_area.push(polygon_area[0]);
      
      $("#parking_polygon").attr("value", polygon_area);
      $("#parking_the_geom_area_original").attr("value", polygon_original);
      //set paintReady flag to false to prevent painting polygon
      paintReady = false;
      polystrip = new H.geo.Strip();
    }
  };

  /*var cns = document.getElementById("clear");
  cns.onclick = function()
  {
    if(polygon)
      map.removeObject(polygon);
    paintReady = true;
  };*/

  //update the shape of polygon by pointermove event
  updatePolygon = function(point) {
    polygon.setStrip(new H.geo.Strip(polystrip.getLatLngAltArray().concat(point.lat, point.lng, undefined)));
  };

  //push polygon to map
  pushPolygon = function(){
    map.removeObject(polyline);
    polygon = new H.map.Polygon(
      polystrip, {
        style: {
          strokeColor: "#f00",
          lineWidth: 1
        }
      }
    );

    map.addObject(polygon);
  };

  //push polyline to map
  pushPolyline = function(){
    polyline = new H.map.Polyline(
      polystrip, {
        style: {
          strokeColor: "#f00",
          lineWidth: 1
        }
      }
    );
       
       polygon_area.push(polygon_area[0]);
      $("#parking_line").attr("value", polygon_area);
      $("#parking_the_geom_area_original").attr("value", polygon_original);
    map.addObject(polyline);
  };
  return {
    init: init
  }
}();



