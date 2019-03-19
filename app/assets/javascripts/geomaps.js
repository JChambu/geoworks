Navarra.namespace("geomaps");

Navarra.geomaps = function (){
  var mymap, markers, editableLayers, projects, layerProjects, MySource, cfg, heatmapLayer, current_tenant , popUpDiv, div, layerControl, url;
  var layerColor, source, baseMaps, overlayMaps, projectFilterLayer, projectss, sld, name_layer;
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
      "radius": 30,
      "maxOpacity": .8,
      "scaleRadius": false,
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
      zoomAnimation: false,
      layers: [streets, grayscale]
    }) ;

    MySource = L.WMS.Source.extend({

      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }

        checked = $('#select').hasClass('active');
        if (!checked){

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
      }
    });

    current_tenant = Navarra.dashboards.config.current_tenant;
    name_layer = Navarra.dashboards.config.name_layer;
    layerProjects = new MySource("http://"+url+":8080/geoserver/wms", {
      layers: "geoworks:" + name_layer,//nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0',//wms version (ver get capabilities)
      tiled: true,
      styles: 'poi_new',
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson'
    })

    projects = layerProjects.getLayer(name_layer).addTo(mymap);

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
    mymap.on('moveend', onMapZoomedMoved);

    $('#select').on('click', function(event) {
      checked = $('#select').hasClass('active');
      if (checked){
        $('#select').removeClass('active');
        $(".fa-draw-polygon").css("color", "#9b9b9b");

        editableLayers.eachLayer(function (layer) {
          mymap.removeLayer(layer);
        });

        HandlerPolygon.disable();
        size_box=[];
        init_kpi();
        init_chart_doughnut();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }
          // mymap.on('click', source.getFeatureInfo, source);

      }else{

        $('#select').addClass('active');
        $(".fa-draw-polygon").css("color", "#d3d800");

        size_box = [];
        // Initialise the draw control and pass it the FeatureGroup of editable layers
        editableLayers = new L.FeatureGroup();
        mymap.addLayer(editableLayers);
        //mymap.off('click', editableLayers.getFeatureInfo, editableLayers);
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
          // poly();

      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }
        })

      }
    });

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
      color: '#d3d800',
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
    console.log(e);
    checked = $('#select').hasClass('active');
    if(!checked){
      show_kpis();
    }
  }

  function wms_filter(){

    var MySourceb = L.WMS.Source.extend({


      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }

        checked = $('#select').hasClass('active');
        if (!checked){
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
      }

    });

    var cql_filter = 'project_type_id='+Navarra.dashboards.config.project_type_id;
    var filter_option = Navarra.project_types.config.filter_option;

    if (filter_option.length > 0){
      $.each(filter_option, function(a,b){
        data_filter = b.split('|');
        cql_filter +=" and "+ data_filter[0]+ " " + data_filter[1] + " " +  data_filter[2];
      });

      mymap.removeLayer(projects);
      if(typeof(projectss)!=='undefined'){
        mymap.removeLayer(projectss);
      }

      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }

      var point_color = Navarra.project_types.config.field_point_colors;

      if(point_color != ''){
        if(typeof(projectss)!=='undefined'){
          mymap.removeLayer(projectss);
        }
        Navarra.geomaps.point_colors_data();
      }else{
          projectFilterLayer = new MySourceb("http://"+url+":8080/geoserver/wms", {
          layers: "geoworks:"+name_layer,//nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: 'true',
          opacity: 1,
          version: '1.0.0',//wms version (ver get capabilities)
          tiled: true,
          styles: 'poi_new',
          INFO_FORMAT: 'application/json',
          format_options: 'callback:getJson',
          CQL_FILTER: cql_filter
        })
        projectss = projectFilterLayer.getLayer(name_layer).addTo(mymap);
      } }else{
        if(typeof(projectss)!=='undefined'){
          mymap.removeLayer(projectss);
        }
        projects.addTo(mymap);
      }

      checked = $('#select').hasClass('active');
      if (!checked){
          init_kpi();
          init_chart_doughnut();
     }
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
            data_filter = b.split('|');
            value_filter +=" and "+ data_filter[0] + data_filter[1] + data_filter[2];
          });
        }
        var env_f = "color:" + col ;
        var options = {

          layers: "geoworks:"+name_layer,//nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: 'true',
          opacity: 1,
          version: '1.0.0',//wms version (ver get capabilities)
          tiled: true,
          styles: 'scale2',
          env: env_f,
          INFO_FORMAT: 'application/json',
          format_options: 'callback:getJson',
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
    init_kpi();
    init_chart_doughnut();
  }

  function heatmap_data(){

  var type_box = 'extent';
  var data_conditions = {}
  if (size_box.length > 0 ){
    var type_box = 'polygon';
  }else{
    size_box = [];
  }

  var conditions = Navarra.project_types.config.filter_kpi
  var  data_id =  Navarra.dashboards.config.project_type_id;
  var  heatmap_field =  Navarra.project_types.config.heatmap_field;

  $.ajax({
    type: 'GET',
    url: '/project_types/filter_heatmap.json',
    datatype: 'json',
    data: {project_type_id: data_id, conditions: conditions, heatmap_field: heatmap_field, size_box: size_box, type_box: type_box},
    success: function(data){

    var min = data[0]['count'];
    last_element = data.length - 1;
      console.log(last_element);
    var max = data[last_element]['count'];

    var legendCanvas = document.createElement('canvas');
    legendCanvas.width = 100;
    legendCanvas.height = 10;
    var legendCtx = legendCanvas.getContext('2d');
    var gradientCfg = {};
    var gradient = legendCtx.createLinearGradient(0, 0, 100, 1);

      gradient.addColorStop(0.25, "rgb(0,0,255)");
      gradient.addColorStop(0.55, "rgb(0,255,0)");
      gradient.addColorStop(0.85, "yellow");
      gradient.addColorStop(1, "rgb(255,0,0)");
      legendCtx.fillStyle = gradient;
      legendCtx.fillRect(0, 0, 100, 10);

      var populationLegend = L.control({position: 'bottomleft'});
      populationLegend.onAdd = function (mymap) {
        if ($('.info_legend').length){
          $('.info_legend').remove();
        }
          var div = L.DomUtil.create('div', 'info_legend');
         div.innerHTML += '<div><span style="float: right">'+ min + '</span><span style="float: left ">  ' + max +'</span>  </div>';
          div.innerHTML +=
 '<img src="' + legendCanvas.toDataURL() +'" alt="legend" width="125" height="25">';
     return div;
   };
populationLegend.addTo(mymap);
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

    //layerControl.addOverlay(heatmapLayer, "heatmap");
    mymap.addLayer(heatmapLayer);
  }
    })
  }

  function remove_heatmap(){
    if(typeof(heatmapLayer)!=='undefined'){
      mymap.removeLayer(heatmapLayer);

        if ($('.info_legend').length){
          $('.info_legend').remove();
        }
    }

  }

  return {
    init: init,
    wms_filter: wms_filter,
    heatmap_data: heatmap_data,
    remove_heatmap: remove_heatmap,
    point_colors_data: point_colors_data
  }
}();
