Navarra.namespace("geomaps");
var first_layer=false;
Navarra.geomaps = function() {
  var mymap, markers, editableLayers, projects, layerProjects, MySource, cfg, heatmapLayer, current_tenant, popUpDiv, div, layerControl, url, protocol, port, type_geometry;
  var layerColor, source, baseMaps, overlayMaps, projectFilterLayer, projectss, sld, name_layer, project_current,project_current_selected,current_tenement;
  var ss = [];
  var size_box = [];


  var init = function() {

    url = window.location.hostname;
    protocol = window.location.protocol;
    if (protocol == 'https:') {
      port = 443
    } else {
      port = 8600
    }

    var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      updateWhenIdle: true,
      reuseTiles: true
    });

    var grayscale = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
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


    mymap = L.map('map', {
      fadeAnimation: false,
      markerZoomAnimation: false,
      zoom: 12,
      center: [-33.113399134183744, -69.69339599609376],
      zoomControl: false,
      zoomAnimation: false,
      layers: [streets]
    });


    type_geometry = Navarra.dashboards.config.type_geometry;
    minx = Navarra.dashboards.config.minx;
    miny = Navarra.dashboards.config.miny;
    maxx = Navarra.dashboards.config.maxx;
    maxy = Navarra.dashboards.config.maxy;

    // Sino existe un proyecto hace zoom a la posición del dispositivo
    if (type_geometry == '') {
      mymap.locate({
        setView: true,
        maxZoom: 13
      });
    }

    mymap.fitBounds([
      [miny, minx],
      [maxy, maxx]
    ]);

    baseMaps = {
      "Calles": streets,
      "Satelital": satellite,
      // "Claro": grayscale,
      "Oscuro": CartoDB_DarkMatter
    };

    var overlays = {};

    layerControl = L.control.layers(baseMaps, overlays, {
      position: 'topleft',
      collapsed: true
    }).addTo(mymap);

    // Agrega el zoom al mapa
    L.control.zoom({
      position: 'topright'
    }).addTo(mymap);

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
    init_time_slider();

    mymap.on('moveend', onMapZoomedMoved);
    if (markers != undefined) {
      mymap.removeLayer(markers);
    }


    mymap.on('draw:drawstart', function(e) {
      Navarra.dashboards.config.draw_disabled = false;
      editableLayers.eachLayer(function(layer) {
        editableLayers.removeLayer(layer);
      })
      const btn_cl = window.document.querySelector('.leaflet-draw-actions li:last-child a');
      btn_cl.addEventListener('click', function(e) {
        Navarra.dashboards.config.draw_disabled = true;
        Navarra.dashboards.config.size_box = mymap.getBounds();
        Navarra.dashboards.config.size_polygon = [];
        init_kpi();
        init_data_dashboard(true);
        init_chart_doughnut();
      });
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
      show_kpis()
      show_data_dashboard();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }
      Navarra.dashboards.config.draw_disabled = true;
    })

    // Desactiva el popup mientras se elimina la selección por polígono
    mymap.on('draw:deletestart', function(e) {
      Navarra.dashboards.config.draw_disabled = false;
    })

    mymap.on('draw:deleted', function(e) {
      editableLayers.eachLayer(function(layer) {
        editableLayers.removeLayer(layer);
      })
      Navarra.dashboards.config.size_box = mymap.getBounds();
      Navarra.dashboards.config.size_polygon = [];
      Navarra.dashboards.config.draw_disabled = true;
      size_box = [];
      init_kpi();
      init_data_dashboard(true);
      init_chart_doughnut();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }
    })

  } // end function init


  function BoundingBox() {
    var bounds = mymap.getBounds().getSouthWest().lng + "," + mymap.getBounds().getSouthWest().lat + "," + mymap.getBounds().getNorthEast().lng + "," + mymap.getBounds().getNorthEast().lat;
    return bounds;
  }


  function show_kpis() {
    if (Navarra.dashboards.config.size_polygon.length == 0) {
      Navarra.dashboards.config.size_box = mymap.getBounds();
      init_kpi();
      init_chart_doughnut();
    } else {
      size_polygon = Navarra.dashboards.config.size_polygon;
      init_kpi(size_polygon);
      init_chart_doughnut(size_polygon);
    }
  }


  function show_data_dashboard() {
      Navarra.dashboards.config.size_box = mymap.getBounds();
      init_data_dashboard(true);
  }


  var LatLngToCoords = function(LatLng, reverse) { // (LatLng, Boolean) -> Array
    var lat = parseFloat(LatLng.lat),
      lng = parseFloat(LatLng.lng);
    return [lng, lat];
  }


  var LatLngsToCoords = function(LatLngs, levelsDeep, reverse) { // (LatLngs, Number, Boolean) -> Array

    var i, len;
    var coords = [];

    for (i = 0, len = LatLngs.length; i < len; i++) {
      coord = LatLngToCoords(LatLngs[i]);
      coords.push(coord);
    }
    return coords;
  }


  function onMapZoomedMoved(e) {
    checked = Navarra.dashboards.config.draw_disabled;
    if (checked) {
      show_kpis();
      show_data_dashboard();
    }
  }


  function wms_filter() {

    var cql_filter = 'project_type_id=' + Navarra.dashboards.config.project_type_id;
    var filter_option = Navarra.project_types.config.filter_option;

    if (filter_option.length > 0) {

      // Aplica filtro por atributo y filros generados por el usuario
      $.each(filter_option, function(a, b) {
        data_filter = b.split('|');
        cql_filter += " and " + data_filter[0] + " " + data_filter[1] + " " + data_filter[2];
      });

      mymap.removeLayer(project_current);
      mymap.removeLayer(project_current_selected);
      if (typeof(projectss) !== 'undefined') {
        mymap.removeLayer(projectss);
      }

      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }

      // Aplica filtro owner
      var owner = Navarra.project_types.config.owner;
      var user_name = Navarra.dashboards.config.user_name;
      if (owner == true) {
        cql_filter += " and app_usuario='" + user_name + "'";
      }

      // Aplica filtro de time_slider
      var from_date = Navarra.project_types.config.from_date;
      var to_date = Navarra.project_types.config.to_date;
      if (from_date != '' || to_date != '') {
        cql_filter += " AND (gwm_created_at BETWEEN '" + from_date + "' AND '" + to_date + "')"
      } else {
        cql_filter += ' AND row_enabled = true'
      }

      var point_color = Navarra.project_types.config.field_point_colors;
      switch (type_geometry) {
        case 'Point':
          style = 'poi_new';
          break;
        case 'Polygon':
          style = 'polygon_new';
          break;
        default:
          style = 'poi_new';
      }

      if (point_color != '') {
        if (typeof(projectss) !== 'undefined') {
          mymap.removeLayer(projectss);
        }
        Navarra.geomaps.point_colors_data();
      } else {
        current_tenement = Navarra.dashboards.config.current_tenement;
        layer_current = current_tenement + ":" + name_layer;
        projectFilterLayer = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
          layers: layer_current, //nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: 'true',
          opacity: 1,
          version: '1.0.0', //wms version (ver get capabilities)
          tiled: true,
          styles: style,
          INFO_FORMAT: 'application/json',
          format_options: 'callback:getJson',
          CQL_FILTER: cql_filter
        })
        projectss = projectFilterLayer.getLayer(layer_current).addTo(mymap);
      }
    } else {
      if (typeof(projectss) !== 'undefined') {
        mymap.removeLayer(projectss);
      }
      project_current.addTo(mymap);
    }
    show_kpis();
    show_data_dashboard();
  }


  function point_colors_data() {

    field_point = Navarra.project_types.config.field_point_colors;
    data_point = Navarra.project_types.config.data_point_colors;
    var filter_option = Navarra.project_types.config.filter_option;

    if (field_point != '') {
      mymap.removeLayer(project_current);
      mymap.removeLayer(project_current_selected);

      if (ss.length > 0) {
        $.each(ss, function(id, layer) {
          mymap.removeLayer(layer);
        });
        mymap.removeControl(layerControl);
        layerControl = L.control.layers(baseMaps, overlayMaps, {
          position: 'topleft',
          collapsed: true
        }).addTo(mymap);
        ss = [];
      }

      if (typeof(projectss) !== 'undefined') {
        mymap.removeLayer(projectss);
      }

      var cql_project_type = 'project_type_id=' + Navarra.dashboards.config.project_type_id;
      $.each(data_point, function(a, b) {

        var cql_name = b['name'];

        var col;
        var value_filter = cql_project_type + " and " + field_point + "='" + cql_name + "' ";

        col = randomColor({
          format: 'hex'
        });

        // Aplica filtro por atributo y filros generados por el usuario
        if (filter_option != '') {
          $.each(filter_option, function(a, b) {
            data_filter = b.split('|');
            value_filter += " and " + data_filter[0] + data_filter[1] + data_filter[2];
          });
        }

        // Aplica filtro de time_slider
        var from_date = Navarra.project_types.config.from_date;
        var to_date = Navarra.project_types.config.to_date;
        if (from_date != '' || to_date != '') {
          cql_filter += " AND (gwm_created_at BETWEEN '" + from_date + "' AND '" + to_date + "')"
        } else {
          cql_filter += ' AND row_enabled = true'
        }

        var env_f = "color:" + col;
        current_tenement = Navarra.dashboards.config.current_tenement;
        layer_current = current_tenement + ":" + name_layer;

        var options = {
          layers: layer_current, //nombre de la capa (ver get capabilities)
          format: 'image/png',
          transparent: 'true',
          opacity: 1,
          version: '1.0.0', //wms version (ver get capabilities)
          tiled: true,
          styles: 'scale2',
          env: env_f,
          INFO_FORMAT: 'application/json',
          format_options: 'callback:getJson',
          CQL_FILTER: value_filter
        };

        source = new L.tileLayer.betterWms(protocol + "//" + url + ":" + port + "/geoserver/wms", options);
        ss.push(source);

        // Elimina corchetes y comillas para leyenda
        if (cql_name !=  null) {
          cql_name = cql_name.replace(/[\[\]\"]/g, "")
        }

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
    } else {
      if (ss.length > 0) {
        $.each(ss, function(id, layer) {
          mymap.removeLayer(layer);
        });
        mymap.removeControl(layerControl);
        mymap.removeLayer(project_current);
        mymap.removeLayer(project_current_selected);
        layerControl = L.control.layers(baseMaps, overlayMaps, {
          position: 'topleft',
          collapsed: true
        }).addTo(mymap);

        if (filter_option.length == 0) {
          current_layer();
        }
        ss = [];
      }
    }
    show_kpis();
  }


  function heatmap_data() {

    var type_box = 'extent';
    size_box = Navarra.dashboards.config.size_polygon;
    var data_conditions = {}
    if (size_box.length > 0) {
      var type_box = 'polygon';
    } else {
      size_box = [];
      type_box = 'extent';
      size_ext = Navarra.dashboards.config.size_box;
      size_box[0] = size_ext['_southWest']['lng'];
      size_box[1] = size_ext['_southWest']['lat'];
      size_box[2] = size_ext['_northEast']['lng'];
      size_box[3] = size_ext['_northEast']['lat'];
    }
    var conditions = Navarra.project_types.config.filter_kpi
    var data_id = Navarra.dashboards.config.project_type_id;
    var heatmap_field = Navarra.project_types.config.heatmap_field;
    var heatmap_indicator = Navarra.project_types.config.heatmap_indicator;
    var from_date = Navarra.project_types.config.from_date;
    var to_date = Navarra.project_types.config.to_date;

    $.ajax({
      type: 'GET',
      url: '/project_types/filter_heatmap.json',
      datatype: 'json',
      data: {
        project_type_id: data_id,
        conditions: conditions,
        heatmap_field: heatmap_field,
        size_box: size_box,
        type_box: type_box,
        heatmap_indicator: heatmap_indicator,
        from_date: from_date,
        to_date: to_date
      },
      success: function(data) {
        count_row = []
        $.each(data, function(a, b) {
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

        var populationLegend = L.control({
          position: 'bottomleft'
        });
        populationLegend.onAdd = function(mymap) {
          if ($('.info_legend').length) {
            $('.info_legend').remove();
          }
          var div = L.DomUtil.create('div', 'info_legend');
          div.innerHTML += '<div><span style="float: right">' + max + '</span><span style="float: left ">  ' + min + '</span>  </div>';
          div.innerHTML +=
            '<img src="' + legendCanvas.toDataURL() + '" alt="legend" width="125" height="25">';
          return div;
        };
        populationLegend.addTo(mymap);
        var testData;
        testData = {
          max: 5,
          data: data
        }

        if (typeof(heatmapLayer) !== 'undefined') {
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


  function remove_heatmap() {
    if (typeof(heatmapLayer) !== 'undefined') {
      mymap.removeLayer(heatmapLayer);

      if ($('.info_legend').length) {
        $('.info_legend').remove();
      }
    }
  }


  function current_layer() {
    name_layer = Navarra.dashboards.config.name_layer;
    var labelLayer;
    $.ajax({
      async: false,
      type: 'GET',
      url: '/project_types/search_name_layer.json',
      data: {
        name_projects: name_layer
      },
      datatype: 'json',
      success: function(data) {
        labelLayer = data['data'][0];
        if (labelLayer == undefined) {
          labelLayer = 'Predeterminada'
        }
      }
    })

    workspace = Navarra.dashboards.config.current_tenement;

    cql_filter = "1 = 1";

    // Aplica filtro por atributo y filros generados por el usuario
    var filter_option = Navarra.project_types.config.filter_option;
    if (filter_option.length > 0) {
      $.each(filter_option, function(a, b) {
        data_filter = b.split('|');
        cql_filter += " and " + data_filter[0] + " " + data_filter[1] + " " + data_filter[2];
      });
    }

    // Aplica filtro owner
    var owner = Navarra.project_types.config.owner;
    var user_name = Navarra.dashboards.config.user_name;
    if (owner == true) {
      cql_filter += " and app_usuario='" + user_name + "'";
    }

    // Aplica filtro intercapa
    var cross_layer_filter = Navarra.project_types.config.cross_layer_filter;
    var cross_layer_owner = Navarra.project_types.config.cross_layer_owner;

    if (cross_layer_filter.length > 0 || cross_layer_owner == true) {

      let cl_name = Navarra.project_types.config.cross_layer
      let cl_clasue = '1 = 1'

      // Aplica filtro intercapa por atributo
      if (cross_layer_filter.length > 0) {
        c_filter = cross_layer_filter[0].split('|');
        cl_clasue += " and " + c_filter[0] +" = '" + c_filter[2] + "'"
      }

      // Aplica filtro intercapa por owner
      if (cross_layer_owner == true) {
        var user_name = Navarra.dashboards.config.user_name;
        cl_clasue += " and app_usuario = ''" + user_name + "''"
      }

      cql_filter += " and INTERSECTS(the_geom, collectGeometries(queryCollection('" + workspace + ':' + cl_name + "', 'the_geom', '" + cl_clasue + "')))"

    }

    // Aplica filtro de time_slider
    var from_date = Navarra.project_types.config.from_date;
    var to_date = Navarra.project_types.config.to_date;
    if (from_date != '' || to_date != '') {
      cql_filter += " AND (gwm_created_at BETWEEN '" + from_date + "' AND '" + to_date + "')"
    } else {
      cql_filter += ' AND row_enabled = true'
    }


    // Aplica filtro de elementos seleccionados en la tabla
    var cql_filter_data_not_selected = "";
    var cql_filter_data_selected = " and 1 = 2";
    var data_from_navarra = Navarra.project_types.config.data_dashboard;

    if(data_from_navarra!=""){
        cql_filter_data_not_selected=" and NOT ("+data_from_navarra+" )";
        cql_filter_data_selected=" and "+data_from_navarra;
        var geometry_draw_array = Navarra.dashboards.config.size_polygon;
        if(geometry_draw_array.length>0){
           geometry_draw = "MULTIPOLYGON(";
           for (xx = 0; xx < geometry_draw_array.length; xx++) {
             if(xx>0){geometry_draw += ",((";}else{geometry_draw += "((";}
            for (x = 0; x < geometry_draw_array[xx].length; x++) {
              if (x > 0) {
                geometry_draw += " , ";
              }
              geometry_draw += geometry_draw_array[xx][x][0] + " " + geometry_draw_array[xx][x][1];
              }
              geometry_draw += "))";
            }
            geometry_draw += ")";
            cql_filter_data_selected+= " and WITHIN(the_geom, "+geometry_draw+")";
            cql_filter_data_not_selected=" and (NOT ("+data_from_navarra+" ) or NOT( WITHIN(the_geom, "+geometry_draw+")))";
        }
   }


   cql_filter_not_selected = cql_filter + cql_filter_data_not_selected;
   cql_filter_selected = cql_filter + cql_filter_data_selected;

   //elimina los puntos dibujados de la capa
    if(first_layer){
      mymap.removeLayer(project_current);
      layerControl.removeLayer(project_current);
      mymap.removeLayer(project_current_selected);
      layerControl.removeLayer(project_current_selected);
    }
     first_layer=true;

    current_layer = workspace + ":" + name_layer;

    // Aplica estilo según tipo de geometría
    let style
    if (type_geometry == 'Point') {
      style = 'poi_new';
    } else {
      style = 'polygon_new';
    }

    // agrega registros NO seleccionados en la tabla
    layerProjects = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
      layers: current_layer, //nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0', //wms version (ver get capabilities)
      tiled: true,
      styles: style,
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson',
      CQL_FILTER: cql_filter_not_selected
    })

    project_current = layerProjects.getLayer(current_layer).addTo(mymap);
    layerControl.addOverlay(project_current, labelLayer, null, {
      sortLayers: false
    });


     // agrega registros seleccionados en la tabla

    let style_selected
    if (type_geometry == 'Point') {
      style = 'poi_new_selected';
    } else {
      style = 'polygon_new_selected';
    }

    layerProjects = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
      layers: current_layer, //nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0', //wms version (ver get capabilities)
      tiled: true,
      styles: style,
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson',
      CQL_FILTER: cql_filter_selected
    })

    project_current_selected = layerProjects.getLayer(current_layer).addTo(mymap);
    if(data_from_navarra!=""){
      layerControl.addOverlay(project_current_selected, " seleccionados", null, {
        sortLayers: false
      });
    }


  }


  function layers_internal() {

    current_layer = Navarra.dashboards.config.name_layer;

    $.ajax({
      type: 'GET',
      url: '/project_types/project_type_layers.json',
      datatype: 'json',
      data: {
        current_layer: current_layer
      },
      success: function(data) {

        $.each(data, function(lay, dat) {

          let layer = dat.layer
          let label_layer = dat.name;
          let color_layer = dat.color;
          let type_geometry = dat.type_geometry
          let workspace = Navarra.dashboards.config.current_tenement;

          // Aplica estilo según tipo de geometría
          let style
          if (dat.type_geometry == 'Point') {
            style = 'poi_new';
          } else {
            style = 'polygon_new';
          }

          if (color_layer == '') {
            color_layer = "#00ff55";
          }

          cql_filter = "1 = 1";

          // Aplica filtro por atributo de la capa
          if (dat.layer_filters.attribute_filter) {
            data_filter = dat.layer_filters.attribute_filter.split('|');
            cql_filter += " and " + data_filter[0] + " " + data_filter[1] + " " + data_filter[2];
          }

          // Aplica filtro por owner de la capa
          if (dat.layer_filters.owner_filter) {
            var user_name = Navarra.dashboards.config.user_name;
            cql_filter += " and app_usuario='" + user_name + "'";
          }

          // Aplica filtro intercapa
          if (dat.layer_filters.cl_filter) {

            let cl_name = dat.layer_filters.cl_filter.cl_name
            let cl_clasue = '1 = 1'

            // Aplica filtro intercapa por atributo
            if (dat.layer_filters.cl_filter.cl_attribute_filter) {
              c_filter = dat.layer_filters.cl_filter.cl_attribute_filter.split('|');
              cl_clasue += " and " + c_filter[0] +" = '" + c_filter[2] + "'"
            }

            // Aplica filtro intercapa por owner
            if (dat.layer_filters.cl_filter.cl_owner_filter) {
              var user_name = Navarra.dashboards.config.user_name;
              cl_clasue += " and app_usuario = ''" + user_name + "''"
            }

            cql_filter += " and INTERSECTS(the_geom, collectGeometries(queryCollection('" + workspace + ':' + cl_name + "', 'the_geom', '" + cl_clasue + "')))"
          }

          // Aplica filtro de time_slider
          var from_date = Navarra.project_types.config.from_date;
          var to_date = Navarra.project_types.config.to_date;
          if (from_date != '' || to_date != '') {
            cql_filter += " AND (gwm_created_at BETWEEN '" + from_date + "' AND '" + to_date + "')"
          } else {
            cql_filter += ' AND row_enabled = true'
          }

          layer_current = workspace + ":" + layer;

          layerSubProjects = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
            layers: layer_current, //nombre de la capa (ver get capabilities)
            format: 'image/png',
            transparent: 'true',
            opacity: 1,
            version: '1.0.0', //wms version (ver get capabilities)
            tiled: true,
            styles: style,
            env: 'color:' + color_layer,
            INFO_FORMAT: 'application/json',
            format_options: 'callback:getJson',
            CQL_FILTER: cql_filter
          })

          projectsa = layerSubProjects.getLayer(layer_current);
          layerControl.addOverlay(projectsa, label_layer, null, {
            sortLayers: true
          });

        }) // Cierra each data
      } // Cierra success
    }) // Cierra ajax
  } // Cierra layers_internal


  function layers_external() {
    //Layer outer
    $.ajax({
      type: 'GET',
      url: '/layers/find.json',
      datatype: 'json',
      success: function(data) {
        $.each(data, function(c, v) {
          let sub_layer = v.layer
          layerSubProjects = new MySource(v.url, {
            layers: v.layer, //nombre de la capa (ver get capabilities)
            format: 'image/png',
            transparent: 'true',
            opacity: 1,
            version: '1.1.1', //wms version (ver get capabilities)
            tiled: true,
            INFO_FORMAT: 'application/json',
            format_options: 'callback:getJson'
          })

          layer_outer = layerSubProjects.getLayer(sub_layer);
          layerControl.addOverlay(layer_outer, v.name, null, {
            sortLayers: true
          });
        })
      }
    })
  }


  function popup() {

    MySource = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {
        if (!this._map) {
          return;
        }
        draw_disabled = Navarra.dashboards.config.draw_disabled;
        if (draw_disabled) {

          var cc = JSON.parse(info);
          if (cc['features'].length > 0) {
            var prop = cc['features'][0]['properties'];
            project_name_feature = cc['features'][0]['id'];
            project_name = project_name_feature.split('.fid')[0];
            var z = document.createElement('p'); // is a node
            var x = []
            var count = 1;
            var project_id = cc['features'][0]['properties']['id'];
            var data_id = Navarra.dashboards.config.project_type_id;
            if (name_layer == project_name) {
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
                    var label = value.toString().replace('_', ' ');
                    // Pone la primer letra en mayúscula
                    label = label.charAt(0).toUpperCase() + label.slice(1)
                    var val = prop[value]
                    // Valida si el valor no es nulo
                    if (val != null && val != 'null') {
                      // Elimina los corchetes y comillas del valor (en caso que contenga)
                      val = val.toString().replace(/\[|\]|\"/g, '');
                      x.push('<b>' + label + ': </b> ' + val);
                    }
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
    show_kpis: show_kpis,
    layers_internal: layers_internal,
    layers_external: layers_external,
    popup: popup
  }
}();
