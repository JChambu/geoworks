Navarra.namespace("geomaps_extended_listings");
Navarra.namespace("geomaps");

Navarra.geomaps_extended_listings = function (){
  var map, marker, editableLayers
  var size_box = [];

  var init= function() {

    var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    var grayscale =L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: '',
      id: 'mapbox.light', 
      accessToken: 'pk.eyJ1IjoiZmxhdmlhYXJpYXMiLCJhIjoiY2ppY2NzMm55MTN6OTNsczZrcGFkNHpoOSJ9.cL-mifEoJa6szBQUGnLmrA'
    });

    mymap = L.map('map',{
      crs: L.CRS.EPSG3857,
      zoom: 7,
      center: [-33.113399134183744, -69.69339599609376],
      zoomControl: false,
      layers: [grayscale,streets]
    }) ;

    if(Navarra.extended_listings.config.lat != null){
      lat = Navarra.extended_listings.config.lat; 
      lon = Navarra.extended_listings.config.lon; 
        marker = L.marker([lat, lon]).addTo(mymap);
        $('#extended_listing_longitude').val(lon);
        $('#extended_listing_latitude').val(lat);
    }
    
    
    $("#move_marker").on('click', function(e){
      if(typeof(marker)!=='undefined'){
       marker.dragging.enable();
        marker.on('dragend', function(event) {
          var position = marker.getLatLng();
          $('#extended_listing_longitude').val(position.lng);
          $('#extended_listing_latitude').val(position.lat);
        });

      }
      e.preventDefault();
    })
    
    $('#add_marker').on('click', function(event){


      mymap.on('click', function(evt){

      if(typeof(marker)!=='undefined'){
        mymap.removeLayer(marker);
      }
     
        marker = L.marker(evt.latlng).addTo(mymap);
        $('#extended_listing_longitude').val(evt.latlng.lng);
        $('#extended_listing_latitude').val(evt.latlng.lat);

  });



  });
    
    var MySource = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {

        if (!this._map) {
          return;
        }
        //               do whatever you like with info
        this._map.openPopup(info, latlng);
      }
    });
  }
  var geocoding = function(opt){

    address = opt.county + " " +  opt.location +" " +  opt.searchTerm
    console.log(address);
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + address, function(data){
      var items = [];
      $.each(data, function(key, val) {
        coord = [val.lat, val.lon]
        $('#extended_listing_longitude').val(val.lon);
        $('#extended_listing_latitude').val(val.lat);
        marker = L.marker(coord).addTo(mymap); 
        var markerBounds = L.latLngBounds(coord[0], coord[1]);
        mymap.fitBounds(markerBounds);
      });
    });
  }

  return {
    init: init,
    geocoding: geocoding
  }
}();


Navarra.geomaps = function (){
  //var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;
  var mymap, markers, editableLayers, projects, layerProjects, MySource, CQL_FILTER;
  var size_box = [];
  var init= function() {
    
    var url = window.location.host;
    var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      updateWhenIdle: true,
      reuseTiles: true
    });

    var grayscale =L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: '',
      id: 'mapbox.light', 
      accessToken: 'pk.eyJ1IjoiZmxhdmlhYXJpYXMiLCJhIjoiY2ppY2NzMm55MTN6OTNsczZrcGFkNHpoOSJ9.cL-mifEoJa6szBQUGnLmrA',
      updateWhenIdle: true,
      reuseTiles: true
    });

    mymap = L.map('map',{
      crs: L.CRS.EPSG3857,
      fadeAnimation: false,
      markerZoomAnimation: false,
      zoom: 12,
      center: [-33.113399134183744, -69.69339599609376],
      zoomControl: false,
      layers: [streets, grayscale]
    }) ;
    mymap.spin(false, {lines: 13, length: 40});
    MySource = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {

        if (!this._map) {
          return;
        }
        //               do whatever you like with info
        //this._map.openPopup(info, latlng);
      }
    });

      current_tenant = Navarra.dashboards.config.current_tenant;
    console.log(current_tenant);
    layerProjects = new MySource("http://www.geoworks.com.ar:8080/geoserver/wms", {
      layers: "view_project_geoserver_"+current_tenant,//nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0',//wms version (ver get capabilities)
      tiled: true,
      style: 'poi_new',
      CQL_FILTER: 'project_type_id='+Navarra.dashboards.config.project_type_id
    })

    projects = layerProjects.getLayer("view_project_geoserver_surba).addTo(mymap);

    minx = Navarra.dashboards.config.minx;   
    miny = Navarra.dashboards.config.miny;   
    maxx = Navarra.dashboards.config.maxx;   
    maxy = Navarra.dashboards.config.maxy;   
   
    mymap.fitBounds([
                  [ miny, minx], 
                  [ maxy ,maxx]
    
    ]);
//    mymap.on('load', onMapLoad);
//    mymap.Projects.getBounds());

    var baseMaps = {
      "Streets": streets,
      "Grayscale": grayscale
    };

    var overlayMaps = {
      "projects": projects
    };

    L.control.layers(baseMaps, overlayMaps).addTo(mymap);

    L.control.zoom({
      position:'topleft'
    }).addTo(mymap);

    if (markers !=undefined){
      mymap.removeLayer(markers);
    }

 /*   function onMapLoad() {
      console.log("paso");
          alert("Map successfully loaded")
    };
*/

    show_kpis();
    mymap.spin(false);
    //mymap.on('zoomend', onMapZoomedMoved);
    mymap.on('moveend', onMapZoomedMoved);

    function onMapZoomedMoved(e) {
   mymap.invalidateSize();    
    mymap.spin(false, {lines: 13, length: 40});
      console.log("Pasa");
      checked = $('#select').hasClass('active');
      if(!checked){
        
        show_kpis();
      }
    mymap.spin(false);
    }


/*    function wms_filter(){
      mymap.removeLayer(layerprojects);
      console.log("gola");
    }*/

    function BoundingBox(){
      var bounds = mymap.getBounds().getSouthWest().lng + "," + mymap.getBounds().getSouthWest().lat + "," + mymap.getBounds().getNorthEast().lng + "," + mymap.getBounds().getNorthEast().lat;
      return bounds;
    }

    function show_kpis(){
      size=[];
      size_box = mymap.getBounds();
      Navarra.dashboards.config.size_box = size_box;  
      init_kpi();
      init_chart_doughnut();  

    }
    /*  markers = L.markerClusterGroup({
      disableClusteringAtZoom: 17
      //maxClusterRadius: 5
    });


    var geoJsonLayer = new L.geoJSON();
    */
      //var owsrootUrl = 'http://45.55.84.16:8080/geoserver/ows';
      //  var owsrootUrl = 'http://localhost:8080/geoserver/ows';

      /*
    var defaultParameters = {
      service: 'WMS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'geoworks:view_project_geoserver',
      maxFeatures: 50000,
      //outputFormat: 'text/javascript',
      outputFormat: 'application/json',

    };
    */
      // defaultParameters.CQL_FILTER = "BBOX(the_geom,"+ BoundingBox() +")";
      //        pnoa.CQL_FILTER ="project_type_id="+Navarra.dashboards.config.project_type_id;
      /* if (FiltrosAcumulados.length > 0 ){
        defaultParameters.CQL_FILTER = "1=1";
        $.each(FiltrosAcumulados, function(a,b){
          var condition_cql = b[0].toLowerCase();
          defaultParameters.CQL_FILTER += " and "+condition_cql+"='"+b[1]+"'";
        });
      }*/
      /* var parameters = L.Util.extend(defaultParameters);
    var URL = owsrootUrl + L.Util.getParamString(parameters);
    //Custom radius and icon create function
    console.log(URL);
    $.ajax({
      url: URL,
      dataType: 'json',
      jsonpCallback: 'parseResponse',
      success: function (data) {
        console.log(data);
        geoJsonLayer.addData(data);         
        markers.addLayer(geoJsonLayer);
        bounds = markers.getBounds();   
        console.log(bounds);
        my  map.fitBounds(bounds);     
        mymap.addLayer(markers);
      }
    });
    */
    /*    var boundaries = new L.WFS({
      url:  'http://localhost:8080/geoserver/ows',
      typeNS: 'geoworks',
      typeName: 'view_project_geoserver',
      crs: L.CRS.EPSG4326,
      style: {
        'color':"#e12a2a",
        'fill' : false,
        'dashArray': "5, 5",
        'weight': 2,
        'opacity': 0.6
      }
    }, new L.Format.GeoJSON({crs: L.CRS.EPSG4326}))
    .addTo(mymap);
    */
    function poly(){ 
      HandlerPolygon = new L.Draw.Polygon(mymap, OpcionesPoligono);
      HandlerPolygon.enable();
    }
    var OpcionesPoligono={
      shapeOptions: {
        color: '#F0D33F',
      }
    }



    $('#select').on('click', function(event) {
      checked = $('#select').hasClass('active');
      if (checked){

        $('#select').removeClass('active');
        editableLayers.eachLayer(function (layer) {
          mymap.removeLayer(layer);
        });
        HandlerPolygon.disable();
        size_box=[];
        init_kpi();
        init_chart_doughnut(); 

      }else{
        $('#select').addClass('active');
        size_box = [];
        // Initialise the draw control and pass it the FeatureGroup of editable layers
        editableLayers = new L.FeatureGroup();
        mymap.addLayer(editableLayers);

        mymap.doubleClickZoom.disable(); 
        poly();
        mymap.on('draw:created', function(e) {

          var arr1 = []
          var type = e.layerType,
            layer = e.layer;
          polygon = layer.getLatLngs();
          editableLayers.addLayer(layer);
          arr1 = LatLngsToCoords(polygon[0]);
          arr1.push(arr1[0])
          size_box.push(arr1);
          init_kpi(size_box);
          init_chart_doughnut(size_box);  
          poly();

        })
      }
    });


    var LatLngToCoords = function (LatLng, reverse) { // (LatLng, Boolean) -> Array
      var lat = parseFloat(LatLng.lat),
        lng = parseFloat(LatLng.lng);
      return [lng,lat];
    }

    var LatLngsToCoords = function (LatLngs, levelsDeep, reverse) { // (LatLngs, Number, Boolean) -> Array

      var i, len;
      var coords=[];

      for (i = 0, len = LatLngs.length; i < len; i++) {
        coord =  LatLngToCoords(LatLngs[i]);
        coords.push(coord);
      }
      return coords;
    }





    /*

      // center of the map
        var center = [-33.8650, 151.2094];

    // Create the map
        var map = L.map('mapid').setView(center, 6);

// Set up the OSM layer
        L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Data © <a href="http://osm.org/copyright">OpenStreetMap</a>',
            maxZoom: 18
          }).addTo(map);

// add a marker in the given location
    L.marker(center).addTo(map);

    // Initialise the FeatureGroup to store editable layers
    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    var drawPluginOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false, // Restricts shapes to simple polygons
          drawError: {
            color: '#e1e100', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: '#97009c'
          }
        },
          // disable toolbar item by setting it to false
        polyline: false,
        circle: false, // Turns off this drawing tool
        rectangle: false,
        marker: false,
      },
      edit: {
        featureGroup: editableLayers, //REQUIRED!!
        remove: false
      }
    };

  // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw(drawPluginOptions);
    map.addControl(drawControl);

    var editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);

    map.on('draw:created', function(e) {
      var type = e.layerType,
        layer = e.layer;

      if (type === 'marker') {
        layer.bindPopup('A popup!');
      }

      editableLayers.addLayer(layer);
    });
    */

}

function wms_filter(){
      mymap.removeLayer(projects);
    projects = layerProjects.getLayer("view_project_geoserver").addTo(mymap);
}



return {
  init: init,
  wms_filter: wms_filter
}
}();
