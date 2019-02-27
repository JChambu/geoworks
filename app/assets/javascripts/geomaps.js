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

    address = opt.county + " " +  opt.location +" " +  opt.searchTerm;
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
  var mymap, markers, editableLayers, projects, layerProjects, MySource, cfg, heatmapLayer, current_tenant , popUpDiv, div, layerControl, url;
  var layerColor, source, baseMaps, overlayMaps, projectFilterLayer, projectss, sld;
  var ss = [];
  var size_box = [];
  var init= function() {

    url = window.location.hostname;
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

    cfg = {
      "radius": 0.003,
      "maxOpacity": .8,
      "scaleRadius": true, 
      "useLocalExtrema": true,
      latField: 'lat',
      lngField: 'lng',
      valueField: 'count'
    };

    mymap = L.map('map',{
      fadeAnimation: false,
      markerZoomAnimation: false,
      zoom: 12,
      center: [-33.113399134183744, -69.69339599609376],
      zoomControl: false,
      layers: [streets, grayscale]
    }) ;

    MySource = L.WMS.Source.extend({
      
      
      
      
      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }
        var ii;
        var cc = JSON.parse(info);
        var prop = cc['features'][0]['properties'];
        var z = document.createElement('p'); // is a node
        var x = []
        $.each(prop, function(a,b){
        
      x.push('<b>' + a + ': </b> ' + b + '</br>');
        })

        z.innerHTML = x;
       inn = document.body.appendChild(z);



        checked = $('#select').hasClass('active');
        if (!checked){
          L.popup()
            .setLatLng(latlng)
            .setContent(inn)
            .openOn(mymap);
        }
      }
    });

    current_tenant = Navarra.dashboards.config.current_tenant;
 sld = '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc"  xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">  <NamedLayer><Name>view_project_geoserver_public</Name>  <UserStyle><Title>Default Point</Title> <Abstract>A sample style that draws a point</Abstract>  <FeatureTypeStyle>  <Rule>  <Name>rule1</Name> <Title>Red Square</Title> <Abstract>A 6 pixel square with a red fill and no stroke</Abstract> <PointSymbolizer> <Graphic> <Mark> <WellKnownName>square</WellKnownName>  <Fill> <CssParameter name="fill-opacity">0.6</CssParameter> </Fill> </Mark> <Size>20</Size> </Graphic> </PointSymbolizer></Rule> </FeatureTypeStyle> </UserStyle> </NamedLayer> </StyledLayerDescriptor>';


    layerProjects = new MySource("http://"+url+":8080/geoserver/wms", {
      layers: "geoworks:view_project_geoserver_"+current_tenant,//nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0',//wms version (ver get capabilities)
      tiled: true,
      SLD_BODY: sld,
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson',
      CQL_FILTER: "project_type_id="+Navarra.dashboards.config.project_type_id
    })

    projects = layerProjects.getLayer("view_project_geoserver_"+current_tenant).addTo(mymap);

    minx = Navarra.dashboards.config.minx;   
    miny = Navarra.dashboards.config.miny;   
    maxx = Navarra.dashboards.config.maxx;   
    maxy = Navarra.dashboards.config.maxy;   

    mymap.fitBounds([
      [ miny, minx], 
      [ maxy ,maxx]

    ]);

    baseMaps = {
      "Streets": streets,
      "Grayscale": grayscale,
    };

    overlayMaps = {
      "Datos": projects
    };

    layerControl = L.control.layers(baseMaps, overlayMaps).addTo(mymap);

    L.control.zoom({
      position:'topleft'
    }).addTo(mymap);

    if (markers !=undefined){
      mymap.removeLayer(markers);
    }

    show_kpis();
    mymap.spin(false);
    mymap.on('moveend', onMapZoomedMoved);

    $('#select').on('click', function(event) {
      checked = $('#select').hasClass('active');
      if (checked){

        $('#select').removeClass('active');
        editableLayers.eachLayer(function (layer) {
          mymap.removeLayer(layer);
        });
        mymap.on('click', source.getFeatureInfo, source);
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
        mymap.off('click', editableLayers.getFeatureInfo, editableLayers);
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

    var htmlLegend1and2 = L.control.htmllegend({
      position: 'bottomright',
      legends: [{
        name: 'Datos',
        layer: projects,
        elements: [{
          label: '',
          html: '',
          style: {
            'background-color': '#d22e2e',
            'width': '10px',
            'height': '10px'
          }
        } ]
      }],
      collapseSimple: true,
      detectStretched: true,
      collapsedOnInit: true,
      defaultOpacity: 0.7,
      visibleIcon: 'icon icon-eye',
      hiddenIcon: 'icon icon-eye-slash'
    })
    mymap.addControl(htmlLegend1and2)


  }//end function init

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
  function poly(){ 
    HandlerPolygon = new L.Draw.Polygon(mymap, OpcionesPoligono);
    HandlerPolygon.enable();
  }
  var OpcionesPoligono={
    shapeOptions: {
      color: '#F0D33F',
    }
  }
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
  function onMapZoomedMoved(e) {
    mymap.invalidateSize();    
    mymap.spin(false, {lines: 13, length: 40});
    checked = $('#select').hasClass('active');
    if(!checked){

      show_kpis();
    }
    mymap.spin(false);
  }

  function wms_filter(){

    var MySourceb = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }
        this._map.openPopup(info, latlng);
      }
    });

    current_tenant = Navarra.dashboards.config.current_tenant;
    var cql_filter = 'project_type_id='+Navarra.dashboards.config.project_type_id;
    var filter_option = Navarra.project_types.config.filter_option;

    if (filter_option.length > 0){
      $.each(filter_option, function(a,b){
        cql_filter +=" and "+ b;
      });      

      mymap.removeLayer(projects);
      if(typeof(projectss)!=='undefined'){
        mymap.removeLayer(projectss);
      }

      var point_color = Navarra.project_types.config.field_point_colors;

      if(point_color != ''){
        if(typeof(projectss)!=='undefined'){
          mymap.removeLayer(projectss);
        }
        Navarra.geomaps.point_colors_data();
      }else{  

        current_tenant = Navarra.dashboards.config.current_tenant;
        projectFilterLayer = new MySourceb("http://"+url+":8080/geoserver/wms", {
          layers: "geoworks:view_project_geoserver_"+current_tenant,//nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: 'true',
          opacity: 1,
          version: '1.0.0',//wms version (ver get capabilities)
          tiled: true,
          styles: 'poi_new',
          CQL_FILTER: cql_filter 
        })
        projectss = projectFilterLayer.getLayer("view_project_geoserver_"+current_tenant).addTo(mymap);
      } }else{
        if(typeof(projectss)!=='undefined'){
          mymap.removeLayer(projectss);
        }
        projects.addTo(mymap);
      }
    init_kpi();
    init_chart_doughnut();  
  }

  function point_colors_data(){

    field_point = Navarra.project_types.config.field_point_colors;
    data_point = Navarra.project_types.config.data_point_colors;
    var filter_option = Navarra.project_types.config.filter_option;
    if (field_point != ''){

      mymap.removeLayer(projects);
      if(ss.length > 0){
        $.each(ss, function (id, layer) {
          mymap.removeLayer(layer);
        });
        mymap.removeControl(layerControl);
        layerControl =  L.control.layers(baseMaps, overlayMaps).addTo(mymap);
        ss = [];
      }

      if(typeof(projectss)!=='undefined'){
        mymap.removeLayer(projectss);
      }

      var cql_project_type = 'project_type_id='+Navarra.dashboards.config.project_type_id;
      $.each(data_point, function(a,b){

        var cql_name= b['name'];
        var col;
        var value_filter = cql_project_type + " and " + field_point + "='"+ cql_name + "' ";
        col = randomColor({
          format: 'hex'
        });


        if (filter_option != ''){
          $.each(filter_option, function(a,b){
            value_filter +=" and "+ b;
          });      
        }
        var env_f = "color:" + col ;
        var options = {

          layers: "geoworks:view_project_geoserver_"+current_tenant,//nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: 'true',
          opacity: 1,
          version: '1.0.0',//wms version (ver get capabilities)
          tiled: true,
          sld_body: sld,
          env: env_f,
          CQL_FILTER: value_filter
        };
        source = new L.tileLayer.betterWms("http://"+url+":8080/geoserver/wms", options);
        ss.push(source);

        var htmlLegend1and2 = L.control.htmllegend({
          position: 'bottomleft',
          legends: [{
            name: cql_name,
            layer: source,
            elements: [{
              label: '',
              html: '',
              style: {
                'background-color': col,
                'width': '10px',
                'height': '10px'
              }
            }]
          }],
          collapseSimple: true,
          detectStretched: true,
          collapsedOnInit: true,
          defaultOpacity: 1,
          visibleIcon: 'icon icon-eye',
          hiddenIcon: 'icon icon-eye-slash'
        })
        mymap.addControl(htmlLegend1and2)
        layerControl.addOverlay(source, cql_name);
        source.addTo(mymap);

        init_kpi();
        init_chart_doughnut();  
      })
    }else{
      if(ss.length > 0){
        $.each(ss, function (id, layer) {
          mymap.removeLayer(layer);
        });
        mymap.removeControl(layerControl);
        layerControl =  L.control.layers(baseMaps, overlayMaps).addTo(mymap);

        if(filter_option.length == 0){ 
          projects.addTo(mymap);
        }
        ss = [];
      }
    }
  }

  function heatmap_data(data){

    var testData;
    testData = {
      max: 5,
      data: data}

    if(typeof(heatmapLayer)!=='undefined'){
      layerControl.removeLayer(heatmapLayer);
      mymap.removeLayer(heatmapLayer);
    }
    heatmapLayer = new HeatmapOverlay(cfg);
    heatmapLayer.setData(testData);

    layerControl.addOverlay(heatmapLayer, "heatmap");
    mymap.addLayer(heatmapLayer);
  }

  return {
    init: init,
    wms_filter: wms_filter,
    heatmap_data: heatmap_data,
    point_colors_data: point_colors_data
  }
}();
