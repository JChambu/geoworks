Navarra.namespace("geomaps");

Navarra.geomaps = function (){
  var mymap, markers, editableLayers, projects, layerProjects, MySource, cfg, heatmapLayer, current_tenant , popUpDiv, div, layerControl, url, type_geometry;
  var layerColor, source, baseMaps, overlayMaps, projectFilterLayer, projectss, sld, name_layer, project_current;
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

  var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

  var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
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


    type_geometry = Navarra.dashboards.config.type_geometry;
    minx = Navarra.dashboards.config.minx;
    miny = Navarra.dashboards.config.miny;
    maxx = Navarra.dashboards.config.maxx;
    maxy = Navarra.dashboards.config.maxy;

    mymap.fitBounds([
      [ miny, minx],
      [ maxy ,maxx]

    ]);
    baseMaps = {
      "Calles": streets,
      "Satelital": satellite,
      "Claro": grayscale,
      "Oscuro": CartoDB_DarkMatter
    };

    var overlays =  {
    };
    layerControl = L.control.layers(baseMaps, overlays, {
      position: 'topleft',
      collapsed: true
    }).addTo(mymap);

    L.control.zoom({
      position:'topleft'
    }).addTo(mymap);

    // Agrega la escala al mapa
    L.control.scale({
      imperial: false,
      position: 'bottomleft',
    }).addTo(mymap);

    MySource = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }

        checked = $('#select').hasClass('active');

        if (!checked) {

          var cc = JSON.parse(info);
          var prop = cc['features'][0]['properties'];
          var z = document.createElement('p'); // is a node
          var x = []
          var count = 1;
          var project_id = cc['features'][0]['properties']['id'];
          var data_id = Navarra.dashboards.config.project_type_id;

          $.ajax({
            type: 'GET',
            url: '/projects/popup.json',
            datatype: 'json',
            data: {
              project_id: project_id
            },
            success: function(data) {

              /* Desactiva reporte hasta que se termine su desarrollo

              data = data['data']

              console.log(data);

              var created_at = data['created_at']
              var properties = data['properties']

              // Pie de página
              function footer() {
                doc.setFontStyle("bold");
                doc.setFontSize(10);
                doc.text('pág. ' + doc.page, 190, 290);
                doc.page++;
              };

              function header() {

                var logo_gw = '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'

                var logo_at2000 = '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'

                doc.addImage(logo_at2000, 'JPEG', 10, 5);
                doc.addImage(logo_gw, 'JPEG', 122, 5);

                doc.setFontSize(16);
                doc.text('Powered by', 152, 10);

                doc.line(10, 30, 200, 30);

              }

              // Creamos el doc
              var doc = new jsPDF();

              doc.page = 1;

              header();

              // Título
              doc.setFontSize(22);
              doc.setFontStyle("bold");
              doc.text('REPORTE', 105, 40, null, null, 'center');

              doc.setFontSize(14);
              doc.setFontStyle("bold");
              doc.text('COORPORACIÓN:', 10, 52);
              doc.setFontStyle("normal");
              doc.text('tomate2000', 57, 52);

              doc.setFontStyle("bold");
              doc.text('PROYECTO:', 10, 60);
              doc.setFontStyle("normal");
              doc.text('CUADROS / RECOMENDACIONES', 44, 60);

              doc.setFontStyle("bold");
              doc.text('FECHA DE CREACIÓN:', 10, 68);
              doc.setFontStyle("normal");
              doc.text('2019-12-17 14:38', 69, 68);

              doc.setFontStyle("bold");
              doc.text('USUARIO:', 10, 76);
              doc.setFontStyle("normal");
              doc.text('super@admin.com', 39, 76);

              var row = 92

              // Pie de página
              footer()

              $.each(properties, function(label, data) {

                // Pone la primer letra en mayúscula
                label = label.charAt(0).toUpperCase() + label.slice(1)

                doc.setFontSize(12);
                doc.setFontStyle("normal");
                doc.text(label + ': ' + data, 10, row);

                if (row > 260) {
                  doc.addPage('a4', 'portrait')
                  header();
                  footer();
                  row = 40;
                } else {
                  row = row + 8;
                }

              }) // Cierra each
              doc.save("Reporte.pdf");
              */
            } // Cierra success
          }); // Cierra ajax



          $.ajax({
            type: 'GET',
            url: '/project_fields/field_popup.json',
            datatype: 'json',
            data: {
              project_type_id: data_id
            },
            success: function(data) {
              $.each(data, function(i, value) {

                // Reemplaza los guiones bajos del label por espacios
                var label = value.split('_').join(' ')
                // Pone la primer letra en mayúscula
                label = label.charAt(0).toUpperCase() + label.slice(1)

                // Elimina los corchetes y comillas del valor (en caso que contenga)
                var val = prop[value]
                var val = val.split('[').join('')
                var val = val.split(']').join('')
                var val = val.split('"').join('')

                x.push('<b>' + label + ': </b> ' + val);

              });
              z.innerHTML = x.join(" <br>");
              inn = document.body.appendChild(z);
              checked = $('#select').hasClass('active');

              if (!checked) {
                L.popup()
                  .setLatLng(latlng)
                  .setContent(inn)
                  .openOn(mymap);
              }
            } // Cierra success
          }); // Cierra ajax
        } // Cierra if
      } // Cierra showFeatureInfo
    }); // Cierra L.WMS.Source.extend

    current_tenant = Navarra.dashboards.config.current_tenant;
    current_layer();
    layers_internal();
    layers_external();
    show_kpis();

    mymap.on('moveend', onMapZoomedMoved);
    if (markers !=undefined){
      mymap.removeLayer(markers);
    }

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

      }else{

        $('#select').addClass('active');
        $(".fa-draw-polygon").css("color", "#d3d800");

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
    console.log(filter_option);
    if (filter_option.length > 0){
      $.each(filter_option, function(a,b){
        data_filter = b.split('|');
        cql_filter +=" and "+ data_filter[0]+ " " + data_filter[1] + " " +  data_filter[2];
      });

      mymap.removeLayer(project_current);
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
        project_current.addTo(mymap);
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
      mymap.removeLayer(project_current);

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
          current_layer();
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
    var data_id =  Navarra.dashboards.config.project_type_id;
    var heatmap_field =  Navarra.project_types.config.heatmap_field;
    var heatmap_indicator = Navarra.project_types.config.heatmap_indicator;

    $.ajax({
      type: 'GET',
      url: '/project_types/filter_heatmap.json',
      datatype: 'json',
      data: {project_type_id: data_id, conditions: conditions, heatmap_field: heatmap_field, size_box: size_box, type_box: type_box, heatmap_indicator: heatmap_indicator},
      success: function(data){

        var min = data[0]['count'];
        last_element = data.length - 1;
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

  function current_layer(){

    var filter_option = Navarra.project_types.config.filter_option;
    console.log(filter_option);
    cql_filter = "1 = 1";
    if (filter_option.length > 0){
        cql_filter +=" and "+ filter_option[0]+ " " + filter_option[1] + " '" +  filter_option[2] + "'";
    }
      name_layer = Navarra.dashboards.config.name_layer;
    switch (type_geometry) {
      case 'Point':
        style = 'poi_new';
        break;
      case 'LineString':
        style = 'line';
        break;
      case 'Polygon':
        style = 'polygon_new';
        break;
      default:
        style = 'poi_new';
    }

    layerProjects = new MySource("http://"+url+":8080/geoserver/wms", {
      layers: "geoworks:" + name_layer,//nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0',//wms version (ver get capabilities)
      tiled: true,
      styles: style,
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson',
      CQL_FILTER: cql_filter
    })

    project_current = layerProjects.getLayer(name_layer).addTo(mymap);
    layerControl.addOverlay(project_current , name_layer, null, {sortLayers: false});

  }



  function layers_internal(){

    name_layer = Navarra.dashboards.config.name_layer;
    $.ajax({
      type: 'GET',
      url: '/project_types/project_type_layers.json',
      datatype: 'json',
      data: {name_projects: name_layer },
      success: function(data){
        $.each(data, function(c,v){
          $.each(v, function(x,y){
            let sub_layer = y.name_layer;
            let color_layer = y.layer_color;
            let type_geometry = y.type_geometry
            let style;
            switch (y.type_geometry) {
              case 'Point':
                style = 'poi_new';
                break;
              case 'LineString':
                style = 'line';
                break;
              case 'Polygon':
                style = 'polygon_new';
                break;
              default:
                style = 'poi_new';
            }
            if (color_layer == '' ){
              color_layer = "#00ff55";
            }
            layerSubProjects = new MySource("http://"+url+":8080/geoserver/wms", {
              layers: "geoworks:" + sub_layer,//nombre de la capa (ver get capabilities)
              format: 'image/png',
              transparent: 'true',
              opacity: 1,
              version: '1.0.0',//wms version (ver get capabilities)
              tiled: true,
              styles: style,
              env: 'color:' + color_layer,
              INFO_FORMAT: 'application/json',
              format_options: 'callback:getJson'
            })

            projectsa = layerSubProjects.getLayer(sub_layer);
            layerControl.addOverlay(projectsa , sub_layer, null, {sortLayers: true});
          })
        })
      }
    })
  }

  function layers_external(){
    //Layer outer
    $.ajax({
      type: 'GET',
      url: '/layers/find.json',
      datatype: 'json',
      success: function(data){
        $.each(data, function(c,v){
          let sub_layer = v.layer
          layerSubProjects = new MySource(v.url, {
            layers: v.layer,//nombre de la capa (ver get capabilities)
            format: 'image/png',
            transparent: 'true',
            opacity: 1,
            version: '1.1.1',//wms version (ver get capabilities)
            tiled: true,
            INFO_FORMAT: 'application/json',
            format_options: 'callback:getJson'
          })

          layer_outer = layerSubProjects.getLayer(sub_layer);
          layerControl.addOverlay(layer_outer , v.name, null, {sortLayers: true});
        })
      }
    })
  }

  return {
    init: init,
    wms_filter: wms_filter,
    heatmap_data: heatmap_data,
    remove_heatmap: remove_heatmap,
    point_colors_data: point_colors_data,
    current_layer: current_layer,
    layers_internal: layers_internal,
    layers_external: layers_external
  }
}();
