/**
 * Congo Geocoding Javascript library
 */
Navarra.namespace("geocoding");

Navarra.geocoding = function(){
  var map, infoBubbles,
  mapContainer, searchManager,
  resultSet, longitude, latitude,
  originalLat, originalLon, addMarkerAround, co_pru,
  platform, geocoder, maptiler, router, enterpriseRouter,
  markupTemplate, group, behavior,
  knownPlaces = [], isMapClickEnabled = false;

  var init = function(lat, lon, originalLat, oroginalLon) {
    //Version 3.0 here    
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
    Navarra.geocoding.originalLat = originalLat;
    Navarra.geocoding.originalLon = oroginalLon;
    //    infoBubbles = new nokia.maps.map.component.InfoBubbles();
    mapContainer = document.getElementById("geocoding-map");
    var defaultLayers = platform.createDefaultLayers();
    map = new H.Map(mapContainer, defaultLayers.normal.map, {
      zoom: 19,
      center: new H.geo.Point(-32.934929,-68.774414)
    });
    var mapEvents = new mapsjs.mapevents.MapEvents(map);
    behavior = new mapsjs.mapevents.Behavior(mapEvents);
    var ui = new mapsjs.ui.UI(map, {
      zoom: true,
      panorama: true
    });
    //    bindMapTypesComboChange();
    addSelectedMarker(lat, lon);
    map.addEventListener('tap', onMapClick);
    searchManager = platform.getPlacesService();
    var routingService = platform.getRoutingService();



  },

  bindMapTypesComboChange = function() {
    map.set("baseMapType", nokia.maps.map.Display.NORMAL_COMMUNITY);
    $("#map-type").change(function() {
      map.set("baseMapType", nokia.maps.map.Display[$("#map-type option:selected").attr("value")]);
    });
  }

  onMapClick = function(evt) {
    if(!isMapClickEnabled) {
      return;
    }

    map.removeObjects(map.getObjects());
    var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    console.log("click");
    addSelectedMarker(coord.lat, coord.lng);
  },

  enableMapClick = function(enabled) {
  console.log(enabled);
    isMapClickEnabled = enabled;
  },


  addOriginalMarker = function() {

    if(!Navarra.geocoding.originalLat || !Navarra.geocoding.originalLon) {
      return;
    }

    markup_initial = markupTemplate.replace('${text}', 'I').replace('${FILL}', '#FF9900');
    icon_initial = new H.map.Icon(markup_initial);
    marker_initial = new H.map.Marker({lat: Navarra.geocoding.originalLat, lng: Navarra.geocoding.originalLon}, {icon: icon_initial});
    map.addObject(marker_initial);
    return;
  },

  addSelectedMarker = function(lat, lon) {
    if(!lat || !lon) {
      return;
    }

    Navarra.geocoding.latitude = lat;
    Navarra.geocoding.longitude = lon;

    text = "S";
    markup = markupTemplate.replace('${text}', text).replace('${FILL}', 'green');
    icon = new H.map.Icon(markup);

    circle = new H.map.Circle({lat: lat, lng: lon}, 400);

    pois_around(lat, lon);
    map.setCenter({lat:lat,lng:lon});
    map.setZoom('19',true);
    var marker_sug = new H.map.Marker({lat: lat, lng: lon}, { icon: icon} )
    map.addObject(marker_sug);
    map.addObject(circle);
    addOriginalMarker();
    //map.zoomTo(map.getBoundingBox(), false);
  },


  pois_around = function (latitude, longitude) {

    $('#datass').html(""); 
    var  poi_type_id = $("#poi_poi_type_id").val();
    $.ajax({
      type: 'GET',
      url: '/pois/around',
      dataType: 'json',
      data: {'latitude': latitude, 'longitude': longitude, 'poi_type_id' : poi_type_id },
      success:  function (data) {

        $('#datass').append('<tr>' +
            '<th>Info</th>' +
            '<th>#</th>' +
            '<th>Identifier</th>' +
            '<th>Nombre</th>' +
            '<th>Calle</th>' + 
            '</tr>');
        $.each(data, function (j, val) {
          st_y = val.st_y;
          st_x = val.st_x;
          markup = markupTemplate.replace('${text}', j).replace('${FILL}', '#8B0000');
          icon = new H.map.Icon(markup);
          if ($("#poi_identifier").val() == val.identifier )
          {
            markup = markupTemplate.replace('${text}', j).replace('${FILL}', '#FFD700');
            icon = new H.map.Icon(markup);
            var markerO = new H.map.Marker({lat:st_y, lng:st_x}, {icon: icon});

          }else{
            var markerO = new H.map.Marker({lat:st_y, lng:st_x}, {icon: icon});

          }
          markerO.draggable = true;
          map.addObject(markerO);
          draggable_marker();


          $('#datass').append('<tr>' +
              '<td> 1</td>' +
              '<td>'+ j + '</td>' +
              "<td><a href='/pois/"  + val.id +  "/edit' target = 'blank'</a>" + val.identifier + "</td>" +
              '<td>'+ val.name + '</td>' +
              '<td>' + val.street_name + ' - ' + val.house_number + '</td>' + 
              '</tr>');

        });
      }})
    return;
  },

  draggable_marker = function(){

    map.addEventListener('dragstart', function(ev) {
      var target = ev.target;
      if (target instanceof H.map.Marker) {
        behavior.disable();
      }
    }, false);

    map.addEventListener('dragend', function(ev) {
      var target = ev.target;
      if (target instanceof mapsjs.map.Marker) {
        behavior.enable();
      }
    }, false);

    // Listen to the drag event and move the position of the marker
    //   // as necessary
    map.addEventListener('drag', function(ev) {
      var target = ev.target,
      pointer = ev.currentPointer;
      if (target instanceof mapsjs.map.Marker) {
        target.setPosition(map.screenToGeo(pointer.viewportX, pointer.viewportY));
      }
    }, false);
  }


 /* addMarker = function(lat, lon, options) {
    var marker = new H.map.Marker({lat: lat, lng: lon}, { icon: options} )
      marker.addEventListener("click", onMarkerClick);
    map.addObject(marker);
    return marker;
  },
*/
  doReverseGeocode = function(opt) {

    var reverseGeoCodeTerm = new nokia.maps.geo.Coordinate(parseFloat(opt["latitude"]), parseFloat(opt["longitude"]));
    map.objects.clear();
    $("#geocoding-map").trigger("geocodingStarted");
    $("body").css("cursor", "progress");

    searchManager.reverseGeoCode({
      latitude: reverseGeoCodeTerm.latitude,
      longitude: reverseGeoCodeTerm.longitude,
      onComplete: processResults
    });
  },

  doGeocode = function(opt){
  
    console.log('geohere');
    var options = {searchTerm: opt.searchTerm}
    if(opt["location"] != null) {
      options["location"] = opt["location"];
    }

    if(opt["department"] != null) {
      options["department"] = opt["department"];
    }

    if(opt["country"] != null) {
      options["country"] = opt["country"];
    }

    if(opt["poi_type_id"] != null) {
      options["poi_type_id"] = opt["poi_type_id"];
    }
 
    
    /*
       if(opt.bbox && opt.bbox.top && opt.bbox.bottom &&
       opt.bbox.top.latitude && opt.bbox.top.longitude &&
       opt.bbox.bottom.latitude && opt.bbox.bottom.longitude) {

       var boundingBox = {
       topLeft: {
       longitude: opt.bbox.top.longitude,
       latitude: opt.bbox.top.latitude
       },
       bottomRight: {
       longitude: opt.bbox.bottom.longitude,
       latitude: opt.bbox.bottom.latitude
       }
       };

       options.boundingBox = boundingBox;
       }
*/
    map.removeObjects(map.getObjects());
    $("#geocoding-map").trigger("geocodingStarted");
    $("body").css("cursor", "progress");
    knownPlaces = [];

/*
    if(opt.knownLocationsUrl) {
    options["knownLocationsUrl"] = opt.knownLocationsUrl;
    findKnownPlaces(options);

    } else {
    findPlaces(options);

    }*/
    findPlaces(options);
  },

  findPlaces = function(options) {

    /*name address*/ 
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

    geocoder.geocode(parameters,onResult,function(e){});
    return;
  },

  

  findKnownPlaces = function(options) {
    $.ajax({
      url: options.knownLocationsUrl,
      type: "GET",
      data: {"search_term": options.searchTerm},
      success: function(result) {
        knownPlaces = result;
        findPlaces(options);
      }
    });
  },


  markupTemplate = '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="36px"><path d="M 19 31 C 19 32.7 16.3 34 13 34 C 9.7 34 7 32.7 7 31 C 7 29.3 9.7 28 13 28 C 16.3 28 19 29.3 19 31 Z" fill="#000" fill-opacity=".2"/><path d="M 13 0 C 9.5 0 6.3 1.3 3.8 3.8 C 1.4 7.8 0 9.4 0 12.8 C 0 16.3 1.4 19.5 3.8 21.9 L 13 31 L 22.2 21.9 C 24.6 19.5 25.9 16.3 25.9 12.8 C 25.9 9.4 24.6 6.1 22.1 3.8 C 19.7 1.3 16.5 0 13 0 Z" fill="#fff"/><path d="M 13 2.2 C 6 2.2 2.3 7.2 2.1 12.8 C 2.1 16.1 3.1 18.4 5.2 20.5 L 13 28.2 L 20.8 20.5 C 22.9 18.4 23.8 16.2 23.8 12.8 C 23.6 7.07 20 2.2 13 2.2 Z" fill="${FILL}"/><text x="13" y="19" font-size="12pt" font-weight="bold" text-anchor="middle" fill="#fff">${text}</text></svg>',

  onResult= function(result) {

     
    $('#datass').html(""); 
    $("body").css("cursor", "auto");
    var lat, lng;

    var locations = result.Response.View[0].Result,
    position,
    marker;





    markup_initial = markupTemplate.replace('${text}', 'I').replace('${FILL}', '#FF9900');
    icon_initial = new H.map.Icon(markup_initial);
    if(addOriginalMarker()) {
      var originalMarker = new  H.map.Marker (
          {lat: parseFloat(Navarra.geocoding.originalLat),
            lng: parseFloat(Navarra.geocoding.originalLon)}, {icon: icon_initial});
      resultSet.objects.add(originalMarker);
    }

    // Add a marker for each location found
    for (i = 0;  i < locations.length; i++) {

      var info_id = i  ;

      $('#datass').append('<tr>' +
          '<th>Info</th>' +
          '<th>#</th>' +
          '<th>Identifier</th>' +
          '<th>Nombre</th>' +
          '<th>Calle</th>' + 
          '</tr>');

      lat =  locations[i].Location.DisplayPosition.Latitude;
      lng =  locations[i].Location.DisplayPosition.Longitude;

      position = {
        lat: lat,
        lng: lng      };




      // we set new zoom level taking into acount 'maxZoom' value

      markup_original = markupTemplate.replace('${text}', info_id).replace('${FILL}', '#18d');
      icon_original = new H.map.Icon(markup_original);
      map.setCenter(position);
      map.setZoom(19, true);
      marker = new H.map.Marker(position, {icon: icon_original});
      map.addEventListener("tap", onMarkerClick);
      
      //marker.addEventListener('tap',onMarkerMouseOver); //sirve para mostrar infobubble
      map.addObject(marker);

      poi_type_id = $("#poi_poi_type_id").val();
      $.ajax({
        type: 'GET',
        url: '/pois/around',
        dataType: 'json',
        data: {'latitude': lat, 'longitude': lng, 'poi_type_id' : poi_type_id },
        success:  function (data) {
          $.each(data, function (j, val) {
            st_y = val.st_y;
            st_x = val.st_x;

            markup = markupTemplate.replace('${text}', j).replace('${FILL}', 'red');
            icon = new H.map.Icon(markup);
            if ($("#poi_identifier").val() == val.identifier )
            {
              var markerO = new H.map.Marker({lat:st_y, lng:st_x}, {icon: icon});

            }else{

              var markerO = new H.map.Marker({lat:st_y, lng:st_x}, {icon: icon});
            }
            markerO.draggable = true;
            map.addObject(markerO );
            draggable_marker();
            $('#datass').append('<tr>' +
                '<td>'+ info_id + '</td>' +
                '<td>'+ j + '</td>' +
                "<td><a href='/pois/"  + val.id +  "/edit' target = 'blank'</a>" + val.identifier + "</td>" +
                '<td>'+ val.name + '</td>' +
                '<td>' + val.street_name + ' - ' + val.house_number + '</td>' + 
                '</tr>');
          });
        }});


      /*    $.each(knownPlaces, function(i, point){
            marker = new H.map.Marker({"latitude": parseFloat(point.lat), "longitude": parseFloat(point.lon)}, knownMarkerOptions);
            resultSet.addObjects.add(marker);
            });
            */
      //    $("#geocoding-map").trigger("markersShown");

      //  map.addObject(resultSet);
      //       map.zoomTo(resultSet.getBoundingBox(), false);

    }
  },

  onMarkerMouseOver = function(evt) {
    var marker = evt.target,
    label = marker.$label,
    address = marker.$address;
    if (marker instanceof H.map.Marker) 
      infoBubbles.addBubble(label, marker.coordinate, false);
  },

  onMarkerClick = function(evt) {
    //map.clearContent();
    //map.removeObject(evt.target);

    map.removeObjects(map.getObjects());
    var coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY); 
    addSelectedMarker(coord.lat, coord.lng);
  };

  return {
    init: init,
   doGeocode: doGeocode,
    doReverseGeocode: doReverseGeocode,
    addSelectedMarker: addSelectedMarker,
    longitude: longitude,
    latitude: latitude,
    enableMapClick: enableMapClick

  }
}();
