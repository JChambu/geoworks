Navarra.namespace("geomaps");

Navarra.geomaps = function (){
  //var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;
  var map, markers, editableLayers
  var size_box = [];
  var init= function() {

    mymap = L.map('mapid',{
      zoomControl: false
    }).setView([-63.8167, -33.8833], 15);

    var Layerppal=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: '',
      maxZoom: 18,
      id: 'mapbox.light',
      accessToken: 'pk.eyJ1IjoiZmxhdmlhYXJpYXMiLCJhIjoiY2ppY2NzMm55MTN6OTNsczZrcGFkNHpoOSJ9.cL-mifEoJa6szBQUGnLmrA'
    }).addTo(mymap);

    L.control.zoom({
      position:'topright'
    }).addTo(mymap);

    if (markers !=undefined){
      mymap.removeLayer(markers);
    }

    mymap.on('zoomend', onMapZoomed);
    //    mymap.on('moveend', onMapMoveend);

    function onMapZoomed(e) {
      checked = $('#select').hasClass('active');
      if(!checked){
        show_kpis();
      }
    }

    function onMapMoveend (e) {
      show_kpis();
    }

    function show_kpis(){
      size=[];
      size_box = mymap.getBounds();
      Navarra.dashboards.config.size_box = size_box;  
      init_kpi();
      init_chart_doughnut();  
    }
    markers = L.markerClusterGroup({
      //disableClusteringAtZoom: false,
      maxClusterRadius: 30
    });
    var geoJsonLayer = new L.geoJSON();
    var owsrootUrl = 'http://localhost:8080/geoserver/ows';
    var defaultParameters = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'geoworks:view_project_geoserver',
      maxFeatures: 1000,
      outputFormat: 'application/json',
    };

    defaultParameters.CQL_FILTER = "project_type_id="+Navarra.dashboards.config.project_type_id  ;
    /* if (FiltrosAcumulados.length > 0 ){
        defaultParameters.CQL_FILTER = "1=1";
        $.each(FiltrosAcumulados, function(a,b){
          var condition_cql = b[0].toLowerCase();
          defaultParameters.CQL_FILTER += " and "+condition_cql+"='"+b[1]+"'";
        });
      }*/
    var parameters = L.Util.extend(defaultParameters);
    var URL = owsrootUrl + L.Util.getParamString(parameters);
    //Custom radius and icon create function
    $.ajax({
      url: URL,
      dataType: 'json',
      jsonpCallback: 'parseResponse',
      success: function (data) {
        geoJsonLayer.addData(data);         
        markers.addLayer(geoJsonLayer);
        bounds = markers.getBounds();   
        mymap.fitBounds(bounds);     
        mymap.addLayer(markers);
      }
    });

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
return {
  init: init
}
}();
