Navarra.namespace("geomaps");

Navarra.geomaps = function (){
  var mymap, markers, editableLayers, projects, layerProjects, MySource, cfg, heatmapLayer, current_tenant , popUpDiv, div, layerControl, url, type_geometry;
  var layerColor, source, baseMaps, overlayMaps, projectFilterLayer, projectss, sld, name_layer, project_current, current_tenement;
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
      layers: [grayscale]
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

    var rose = L.control.rose('rose', {
      position: 'topright',
      icon: 'default',
      iSize: 'small',
      opacity: 0.5
    });
    rose.addTo(mymap)

    editableLayers = new L.FeatureGroup();
    mymap.addLayer(editableLayers);
    var drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
        	shapeOptions: {
            	color: '#d3d800'
            }
        },
        rectangle: {
        	shapeOptions: {
            	color: '#d3d800'
            }
        },
        polyline: false,
        circle: true,
        marker: true
      },
      edit: {
        featureGroup: editableLayers,
        edit: false,
        remove: true
      }
    });
    L.drawLocal = {
      draw: {
        toolbar: {
          actions: {
            title: 'Cancel drawing',
            text: 'Cancelar'
          },
          finish: {
            title: 'Finish drawing',
            text: 'Finalizar'
          },
          undo: {
            title: 'Delete last point drawn',
            text: 'Eliminar el último punto'
          },
          buttons: {
            polygon: 'Polígono',
            rectangle: 'Rectángulo',
            circle: 'Círculo',
            marker: 'Punto',
          }
        },
        handlers: {
          circle: {
            tooltip: {
              start: 'Haga click en el mapa y arrastre para dibujar un círculo.'
            },
            radius: 'Radio'
          },
          polygon: {
            tooltip: {
              start: 'Haga click para comenzar a dibujar el polígono.',
              cont: 'Haga click para continuar dibujando el polígono.',
              end: 'Haga click en el primer punto para cerrar este polígono.'
            }
          },
          polyline: {
            error: '<strong>Error:</strong> los bordes del polígono no pueden cruzarse.',
            tooltip: {
              start: 'Click to start drawing line.',
              cont: 'Click to continue drawing line.',
              end: 'Click last point to finish line.'
            }
          },
          rectangle: {
            tooltip: {
              start: 'Haga click en el mapa y arrastre para dibujar un rectángulo.'
            }
          },
          simpleshape: {
            tooltip: {
              end: 'Suelte el mouse para terminar de dibujar.'
            }
          }
        }
      },
      edit: {
        toolbar: {
          actions: {
            save: {
              title: 'Aplicar cambios',
              text: 'Aplicar'
            },
            cancel: {
              title: 'Cancelar cambios',
              text: 'Cancelar'
            },
            clearAll: {
              title: 'Clear all layers',
              text: 'Limpiar todo'
            }
          },
          buttons: {
            edit: 'Editar',
            editDisabled: 'Nada para editar',
            remove: 'Eliminar',
            removeDisabled: 'Nada para eliminar'
          }
        },
        handlers: {
          edit: {
            tooltip: {
              text: 'Drag handles or markers to edit features.',
              subtext: 'Click cancel to undo changes.'
            }
          },
          remove: {
    				tooltip: {
    					text: 'Haga click en una geometría para eliminarla.'
    				}
    			}
        }
      }
    };

    mymap.addControl(drawControl);

    // Elimina la opción "Eliminar último punto" del toolbar
    $('.leaflet-draw-draw-polygon').on('click', function() {
      $('.leaflet-draw-actions > li:nth-child(1) > a').remove()
    });

    // Deshabilita los botones Círculo y Marker del toolbar
    $('.leaflet-draw-draw-circle').addClass('unselectable')
    $('.leaflet-draw-draw-marker').addClass('unselectable')

    // Agrega el zoom al mapa
    L.control.zoom({
      position:'bottomright'
    }).addTo(mymap);

    // Agrega la escala al mapa
    L.control.scale({
      imperial: false,
      position: 'bottomleft',
    }).addTo(mymap);


    popup();
    current_tenant = Navarra.dashboards.config.current_tenant;
    current_layer();
    layers_internal();
    layers_external();
    show_kpis();

    mymap.on('moveend', onMapZoomedMoved);
    if (markers !=undefined){
      mymap.removeLayer(markers);
    }
    mymap.on('draw:drawstart', function(e){
      Navarra.dashboards.config.draw_disabled = false;
      editableLayers.eachLayer(function(layer){
        editableLayers.removeLayer(layer);
      })
    })
    mymap.on('draw:created', function(e) {
      size_box = [];
      var arr1 = []
      var type = e.layerType,
        layer = e.layer;
      polygon = layer.getLatLngs();
      editableLayers.addLayer(layer);
      arr1 = LatLngsToCoords(polygon[0]);
      arr1.push(arr1[0])
      size_box.push(arr1);
      Navarra.dashboards.config.size_polygon.push(arr1);
      init_kpi(size_box);
      init_chart_doughnut(size_box);
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }
    })

    mymap.on('draw:deleted', function(e){
      editableLayers.eachLayer(function(layer){
        editableLayers.removeLayer(layer);
      })
      Navarra.dashboards.config.size_box = mymap.getBounds();
      Navarra.dashboards.config.size_polygon = [];
      Navarra.dashboards.config.draw_disabled = true;
      size_box=[];
      init_kpi();
      init_chart_doughnut();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }
    })

  }//end function init

  function BoundingBox(){
    var bounds = mymap.getBounds().getSouthWest().lng + "," + mymap.getBounds().getSouthWest().lat + "," + mymap.getBounds().getNorthEast().lng + "," + mymap.getBounds().getNorthEast().lat;
    return bounds;
  }
  function show_kpis(){
    if(Navarra.dashboards.config.size_polygon.length == 0){
      Navarra.dashboards.config.size_box = mymap.getBounds();
      init_kpi();
      init_chart_doughnut();
    }else{
      size_polygon = Navarra.dashboards.config.size_polygon;
      init_kpi(size_polygon);
      init_chart_doughnut(size_polygon);
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
    checked = Navarra.dashboards.config.draw_disabled;
    if(checked){
      show_kpis();
    }
  }

  function wms_filter(){

    var cql_filter = 'project_type_id='+Navarra.dashboards.config.project_type_id;
    var filter_option = Navarra.project_types.config.filter_option;

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

      var owner = Navarra.project_types.config.owner;
      var user_name = Navarra.dashboards.config.user_name;
      if (owner == true){
        cql_filter += " and app_usuario='"+user_name +"'";
      }
      var point_color = Navarra.project_types.config.field_point_colors;
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

      if(point_color != ''){
        if(typeof(projectss)!=='undefined'){
          mymap.removeLayer(projectss);
        }
        Navarra.geomaps.point_colors_data();
      }else{
        current_tenement = Navarra.dashboards.config.current_tenement;
        layer_current= current_tenement +":"+ name_layer;
        projectFilterLayer = new MySource("http://"+url+":8080/geoserver/wms", {
          layers: layer_current,//nombre de la capa (ver get capabilities)
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
        projectss = projectFilterLayer.getLayer(layer_current).addTo(mymap);
      } }else{
        if(typeof(projectss)!=='undefined'){
          mymap.removeLayer(projectss);
        }
        project_current.addTo(mymap);
      }
    show_kpis();
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
        layerControl =  L.control.layers(baseMaps, overlayMaps, {
          position: 'topleft',
          collapsed: true
        }).addTo(mymap);
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
        current_tenement = Navarra.dashboards.config.current_tenement;
        layer_current= current_tenement +":"+ name_layer;
        var options = {


          layers: layer_current,//nombre de la capa (ver get capabilities)
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
        mymap.removeLayer(project_current);
        layerControl =  L.control.layers(baseMaps, overlayMaps, {
          position: 'topleft',
          collapsed: true
        }).addTo(mymap);

        if(filter_option.length == 0){
          current_layer();
        }
        ss = [];
      }
    }
    show_kpis();
  }

  function heatmap_data(){

    var type_box = 'extent';
    size_box = Navarra.dashboards.config.size_polygon;
    var data_conditions = {}
    if (size_box.length > 0 ){
      var type_box = 'polygon';
    }else{
      size_box = [];
      type_box = 'extent';
      size_ext = Navarra.dashboards.config.size_box;
      size_box[0] = size_ext['_southWest']['lng'];
      size_box[1] = size_ext['_southWest']['lat'];
      size_box[2] = size_ext['_northEast']['lng'];
      size_box[3] = size_ext['_northEast']['lat'];
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
        count_row = []
        $.each(data,function(a,b){
          count_row.push(parseFloat(b['count']));
        })

        min = Math.min(...count_row);
        max = Math.max(...count_row);
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
          div.innerHTML += '<div><span style="float: right">'+ max + '</span><span style="float: left ">  ' + min +'</span>  </div>';
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

    name_layer = Navarra.dashboards.config.name_layer;
    var labelLayer;
    $.ajax({
      async: false,
      type: 'GET',
      url: '/project_types/search_name_layer.json',
      data: {name_projects: name_layer },
      datatype: 'json',
      success: function(data){
        labelLayer = data['data'][0];
      }
    })
    var filter_option = Navarra.project_types.config.filter_option;
    cql_filter = "1 = 1";
    if (filter_option.length > 0){
      cql_filter +=" and "+ filter_option[0]+ " " + filter_option[1] + " '" +  filter_option[2] + "'";
    }
    var owner = Navarra.project_types.config.owner;
    var user_name = Navarra.dashboards.config.user_name;
    if (owner == true){
      cql_filter += " and app_usuario='"+user_name +"'";
    }

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
    current_tenement = Navarra.dashboards.config.current_tenement;
    layer_current= current_tenement +":"+ name_layer;
    layerProjects = new MySource("http://"+url+":8080/geoserver/wms", {
      layers: layer_current,//nombre de la capa (ver get capabilities)
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

    project_current = layerProjects.getLayer(layer_current).addTo(mymap);
    layerControl.addOverlay(project_current , labelLayer, null, {sortLayers: false});

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
            let label_layer = y.name;
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

            current_tenement = Navarra.dashboards.config.current_tenement;
            layer_current= current_tenement +":"+ sub_layer;
            layerSubProjects = new MySource("http://"+url+":8080/geoserver/wms", {
              layers: layer_current,//nombre de la capa (ver get capabilities)
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

            projectsa = layerSubProjects.getLayer(layer_current);
            layerControl.addOverlay(projectsa , label_layer, null, {sortLayers: true});
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

  function popup(){

    MySource = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }
        draw_disabled = Navarra.dashboards.config.draw_disabled;
        if (draw_disabled){

          var cc = JSON.parse(info);
          if (cc['features'].length > 0){
            var prop = cc['features'][0]['properties'];
            project_name_feature = cc['features'][0]['id'];
            project_name = project_name_feature.split('.fid')[0];
            var z = document.createElement('p'); // is a node
            var x = []
            var count = 1;
            var project_id = cc['features'][0]['properties']['id'];
            var data_id = Navarra.dashboards.config.project_type_id;
            if (name_layer == project_name){
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
                    var label = value.toString().replace('_',' ');
                    // Pone la primer letra en mayúscula
                    label = label.charAt(0).toUpperCase() + label.slice(1)
                    var val = prop[value]
                    // Valida si el valor no es nulo
                    if (val != null && val != 'null' ) {
                      // Elimina los corchetes y comillas del valor (en caso que contenga)
                      val = val.toString().replace('/\[|\]|\"','');
                    }
                    x.push('<b>' + label + ': </b> ' + val);
                  });
                  z.innerHTML = x.join(" <br>");
                  inn = document.body.appendChild(z);
                  checked = $('#select').hasClass('active');

                  if (draw_disabled) {
                    L.popup()
                      .setLatLng(latlng)
                      .setContent(inn)
                      .openOn(mymap);
                  }
                } // Cierra success
              }); // Cierra ajax
            } // Cierra if
          } // Cierra if
        } // Cierra if
      } // Cierra showFeatureInfo
    }); // Cierra L.WMS.Source.extend
  }

  return {
    init: init,
    wms_filter: wms_filter,
    heatmap_data: heatmap_data,
    remove_heatmap: remove_heatmap,
    point_colors_data: point_colors_data,
    current_layer: current_layer,
    layers_internal: layers_internal,
    layers_external: layers_external,
    popup: popup
  }
}();
