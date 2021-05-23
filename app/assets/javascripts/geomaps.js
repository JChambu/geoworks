var xhr_heatmap = null;
var xhr_namelayer = null;
var xhr_current_layer = null;
var xhr_layer_external = null;
var xhr_popup = null;

Navarra.namespace("geomaps");
var first_layer=false;
var layer_array=[];
Navarra.geomaps = function() {
  var mymap, markers, editableLayers, projects, layerProjects, layerProjectsSelected, MySource, cfg, heatmapLayer, current_tenant, popUpDiv, div, layerControl, url, protocol, port, type_geometry;
  var layerColor, source, baseMaps, overlayMaps, projectFilterLayer, projectss, sld, name_layer, project_current,project_current_selected,current_tenement;
  var ss = [];
  var size_box = [];
  var myLocalStorage = window.localStorage;
  var last_lat = 0;
  var last_long = 0;
  var inn = ""
  var first_time_internal_layers = true;

  var init = function() {

    //crea nodo para popup
    var z = document.createElement('DIV'); // is a node
    z.id = "popup_created";
    document.body.appendChild(z);
    //fin nodo

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
      reuseTiles: true,
      maxZoom: 20,
      maxNativeZoom: 18
    });

    var grayscale = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: '',
      id: 'mapbox/light-v10',
      accessToken: 'pk.eyJ1IjoiZ2lzd29ya2luZ21hcCIsImEiOiJja21lenQ3bG0zMGg4MndvamtrNjdhbzl4In0.sxBssnfTVHWdklOJDZsIjA',
      updateWhenIdle: true,
      reuseTiles: true,
      maxZoom: 20,
      maxNativeZoom: 18
    });

    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 20,
      maxNativeZoom: 18
    });

    var CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
      maxNativeZoom: 19
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

    var last_zoom= myLocalStorage.getItem('zoom');
    var last_latitude= myLocalStorage.getItem('latitude');
    var last_longitude= myLocalStorage.getItem('longitude');
    if(last_zoom==null){last_zoom=12}
    if(last_latitude==null){last_latitude=-33.113399134183744}
    if(last_longitude==null){last_longitude=-69.69339599609376}
    mymap = L.map('map', {
      fadeAnimation: false,
      markerZoomAnimation: false,
      zoom: last_zoom,
      center: [last_latitude, last_longitude],
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

    if(myLocalStorage.getItem('zoom')==null){
      mymap.fitBounds([
        [miny, minx],
        [maxy, maxx]
      ]);
    }

    baseMaps = {
      "Calles": streets,
      "Satelital": satellite,
      "Claro": grayscale,
      "Oscuro": CartoDB_DarkMatter
    };

    //genera Modal de mapas base y proyecto activo
    Object.keys(baseMaps).forEach(function(key,index){
      if(index==0){var checked_text ="checked=true"} else {checked_text=""}
      var new_item = '<a class="dropdown-item" href="#"><div class="custom-control custom-checkbox" style="display: inline-block;">'+
                    '<input class="custom-control-input" '+checked_text +' onchange="select_layer()" id="mapabase_'+key+'" type="radio" name="radio_mapabase">'+
                    '<label class="string optional control-label custom-control-label" for="mapabase_'+key+'"> </label>'+
                    '</div>'+
                    '<label for=mapa_base1>'+key+'</label></a>';
      $('#basemaps_container').append(new_item);    
    });
    var new_item = '<a class="dropdown-item" href="#"><div class="custom-control custom-checkbox" style="display: inline-block;">'+
                    '<input class="custom-control-input" checked=true onchange="select_layer()" id="checkbox_'+Navarra.dashboards.config.name_layer+'" type="checkbox" name="radio_mapabase">'+
                    '<label class="string optional control-label custom-control-label" for="checkbox_'+Navarra.dashboards.config.name_layer+'"> </label>'+
                    '</div>'+
                    '<label for=mapa_base1>'+Navarra.dashboards.config.name_project+'</label></a>';
      $('#activeproject_container').append(new_item);    
      var new_item = '<a class="dropdown-item" href="#" id="checkbox_div_Seleccionados"><div class="custom-control custom-checkbox" style="display: inline-block;">'+
                    '<input class="custom-control-input" onchange="select_layer()" id="checkbox_Seleccionados" type="checkbox" name="radio_mapabase">'+
                    '<label class="string optional control-label custom-control-label" for="checkbox_Seleccionados"> </label>'+
                    '</div>'+
                    '<label for=mapa_base1>Seleccionados</label></a>';
      $('#activeproject_container').append(new_item);    
    // termina modal mapa base y proyecto activo

    var overlays = {};

    layerControl = L.control.layers(baseMaps, overlays, {
      position: 'topleft',
      collapsed: true
    }).addTo(mymap);

    // Agrega el zoom al mapa
    L.control.zoom({
      position: 'topright'
    }).addTo(mymap);

    //agrega boton zoomextend
    L.Control.ZoomExtend = L.Control.extend({
      onAdd: function(map) {
        var container = L.DomUtil.create('DIV');
        container.className = "leaflet-control-zoom leaflet-bar leaflet-control";
        var new_a = L.DomUtil.create('A');
        new_a.className = "leaflet-draw-draw-polygon";
        new_a.title = "Mostrar Todo"
        var img = L.DomUtil.create('I');
        img.className = 'fas fa-expand-arrows-alt';
        img.style.color = "white";
        img.style.cursor = "pointer"
        new_a.appendChild(img)
        container.appendChild(new_a);

        onClick = function(event) {
          get_zoomextent();
        };
        L.DomEvent.addListener(container, 'click', onClick, this);

        return container;
      },
    });

    L.control.ZoomExtend = function(opts) {
      return new L.Control.ZoomExtend(opts);
    }
    L.control.ZoomExtend({ position: 'topright' }).addTo(mymap);

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
    myLocalStorage.setItem('zoom', mymap.getZoom());
    myLocalStorage.setItem('latitude', mymap.getCenter().lat);
    myLocalStorage.setItem('longitude', mymap.getCenter().lng);
    checked = Navarra.dashboards.config.draw_disabled;
    if (checked) {
      show_kpis();
      show_data_dashboard();
    }
  }


  function wms_filter() {

    var cql_filter = 'project_type_id = ' + Navarra.dashboards.config.project_type_id;

    // Aplica filtros por hijos generados por el usuario
    var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
    if (filtered_form_ids.length) {
      let final_array = [];
      for (var i = 0; i < filtered_form_ids.length; i++) {
        let ids_array = JSON.parse(filtered_form_ids[i])
        if (final_array.length) {
          final_array = final_array.filter(value => ids_array.includes(value));
        } else {
          final_array = ids_array
        }
      }
      final_array = final_array.toString()
      cql_filter += ' and app_id IN (' + final_array + ')';
    }

    // Aplica filtro por atributo y filros padres generados por el usuario
    var attribute_filters = Navarra.project_types.config.attribute_filters;
    if (attribute_filters.length) {
      $.each(attribute_filters, function(a, b) {
        data_filter = b.split('|');
        cql_filter += " and " + data_filter[0] + " " + data_filter[1] + " '" + data_filter[2] + "'";
      });
    }

    // Aplica filtro owner
    var owner = Navarra.project_types.config.owner;
    if (owner == true) {
      var user_name = Navarra.dashboards.config.user_name;
      cql_filter += " and app_usuario='" + user_name + "'";
    }

    // Aplica filtro intercapa
    var cross_layer_filter = Navarra.project_types.config.cross_layer_filter;
    var cross_layer_owner = Navarra.project_types.config.cross_layer_owner;
    if (cross_layer_filter.length || cross_layer_owner == true) {
      let cl_name = Navarra.project_types.config.cross_layer
      let cl_clasue = '1 = 1'

      // Aplica filtro intercapa por atributo
      if (cross_layer_filter.length > 0) {
        c_filter = cross_layer_filter[0].split('|');
        cl_clasue += " and " + c_filter[0] +" = ''" + c_filter[2] + "''"
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

    var heatmap_actived = Navarra.project_types.config.heatmap_field;
    if (heatmap_actived != '') {
      Navarra.geomaps.heatmap_data();
    }

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

    mymap.removeLayer(project_current);
    mymap.removeLayer(project_current_selected);
    if (typeof(projectss) !== 'undefined') {
      mymap.removeLayer(projectss);
    }

    current_tenement = Navarra.dashboards.config.current_tenement;
    layer_current = current_tenement + ":" + name_layer;
    projectFilterLayer = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
      layers: layer_current, //nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0', //wms version (ver get capabilities)
      tiled: true,
      maxZoom: 20,
      styles: style,
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson',
      CQL_FILTER: cql_filter
    })
    projectss = projectFilterLayer.getLayer(layer_current).addTo(mymap);
    // actualiza datos y mapa init_data y show_kpi los ejecuta solo si elo mapa no se mueve
    //show_kpis();
    //show_data_dashboard();
    //recalcula las capas internas
    Navarra.project_types.config.current_layer_filters = cql_filter;
    layers_internal();
  }

  // NOTE: La herramienta Colorear Puntos está descontinuada
  function point_colors_data() {

    field_point = Navarra.project_types.config.field_point_colors;
    data_point = Navarra.project_types.config.data_point_colors;
    var attribute_filters = Navarra.project_types.config.attribute_filters;

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
        if (attribute_filters != '') {
          $.each(attribute_filters, function(a, b) {
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
          maxZoom: 20,
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

        if (attribute_filters.length == 0) {
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
    var attribute_filters = Navarra.project_types.config.attribute_filters
    var data_id = Navarra.dashboards.config.project_type_id;
    var heatmap_field = Navarra.project_types.config.heatmap_field;
    var heatmap_indicator = Navarra.project_types.config.heatmap_indicator;
    var from_date = Navarra.project_types.config.from_date;
    var to_date = Navarra.project_types.config.to_date;

    if(xhr_heatmap && xhr_heatmap.readyState != 4) {
      xhr_heatmap.abort();
    }
    xhr_heatmap = $.ajax({
      type: 'GET',
      url: '/project_types/filter_heatmap.json',
      datatype: 'json',
      data: {
        project_type_id: data_id,
        conditions: attribute_filters,
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
    var labelLayer = Navarra.dashboards.config.name_layer;
    workspace = Navarra.dashboards.config.current_tenement;
    cql_filter = "1 = 1";

    // Aplica filtros por hijos generados por el usuario
    var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
    if (filtered_form_ids.length) {
      let final_array = [];
      for (var i = 0; i < filtered_form_ids.length; i++) {
        let ids_array = JSON.parse(filtered_form_ids[i])
        if (final_array.length) {
          final_array = final_array.filter(value => ids_array.includes(value));
        } else {
          final_array = ids_array
        }
      }
      final_array = final_array.toString()
      cql_filter += ' and app_id IN (' + final_array + ')';
    }

    // Aplica filtro por atributo y filros generados por el usuario
    var attribute_filters = Navarra.project_types.config.attribute_filters;
    if (attribute_filters.length > 0) {
      $.each(attribute_filters, function(a, b) {
        data_filter = b.split('|');
        cql_filter += " and " + data_filter[0] + " " + data_filter[1] + " '" + data_filter[2] + "'";
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
        cl_clasue += " and " + c_filter[0] +" = ''" + c_filter[2] + "''"
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

    // Asigna todos los filtros a una variable global
    Navarra.project_types.config.current_layer_filters = cql_filter;

    // Aplica filtro de elementos seleccionados en la tabla
    var cql_filter_data_not_selected = "";
    var cql_filter_data_selected = " and 1 = 2";
    var data_from_navarra = Navarra.project_types.config.data_dashboard;
    if (data_from_navarra != "") {
      cql_filter_data_not_selected = " and NOT (" + data_from_navarra + " )";
      cql_filter_data_selected = " and (" + data_from_navarra + " )";
      var geometry_draw_array = Navarra.dashboards.config.size_polygon;

      if (geometry_draw_array.length > 0) {
        geometry_draw = "MULTIPOLYGON(";
        for (xx = 0; xx < geometry_draw_array.length; xx++) {
          if (xx > 0) {
            geometry_draw += ",((";
          } else {
            geometry_draw += "((";
          }
          for (x = 0; x < geometry_draw_array[xx].length; x++) {
            if (x > 0) {
              geometry_draw += " , ";
            }
            geometry_draw += geometry_draw_array[xx][x][0] + " " + geometry_draw_array[xx][x][1];
          }
          geometry_draw += "))";
        }
        geometry_draw += ")";
        cql_filter_data_selected += " and WITHIN(the_geom, " + geometry_draw + ")";
        cql_filter_data_not_selected = " and (NOT (" + data_from_navarra + " ) or NOT( WITHIN(the_geom, " + geometry_draw + ")))";
      }

    }


    cql_filter_not_selected = cql_filter + cql_filter_data_not_selected;
    cql_filter_selected = cql_filter + cql_filter_data_selected;

    //elimina los puntos dibujados de la capa
    if (first_layer) {
      mymap.removeLayer(project_current);
      layerControl.removeLayer(project_current);
      mymap.removeLayer(project_current_selected);
      layerControl.removeLayer(project_current_selected);
    }
    first_layer = true;

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
      maxZoom: 20,
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

    layerProjectsSelected = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
      layers: current_layer, //nombre de la capa (ver get capabilities)
      format: 'image/png',
      transparent: 'true',
      opacity: 1,
      version: '1.0.0', //wms version (ver get capabilities)
      tiled: true,
      maxZoom: 20,
      styles: style,
      INFO_FORMAT: 'application/json',
      format_options: 'callback:getJson',
      CQL_FILTER: cql_filter_selected
    })

    console.log(cql_filter_selected)
    console.log(cql_filter_not_selected)
    project_current_selected = layerProjectsSelected.getLayer(current_layer).addTo(mymap);
    if(data_from_navarra!=""){
      layerControl.addOverlay(project_current_selected, "Seleccionados", null, {
        sortLayers: false
      });
      $('#checkbox_div_Seleccionados').removeClass('d-none');
      $('#checkbox_Seleccionados').prop("checked",true);
    } else{
      $('#checkbox_div_Seleccionados').addClass('d-none');
      $('#checkbox_Seleccionados').prop("checked",false);
    }
  }


  function layers_internal() {
    current_layer = Navarra.dashboards.config.name_layer;
    current_layer_name = Navarra.dashboards.config.name_layer;

    // verifica que capas estás chequeadas
    var active_internal_layers=[];
    var check_layers = document.querySelectorAll('input:checked.leaflet-control-layers-selector');
    for(l=0; l<check_layers.length; l++){
      if(check_layers[l].type=='checkbox'){
        var name_layer_project = $(check_layers[l]).next().html().substring(1);

        if(name_layer_project.toLowerCase()!=current_layer_name.toLowerCase() && name_layer_project.toLowerCase()!="seleccionados" )
        active_internal_layers.push(name_layer_project);
      }
    }


    // elimina las capas creadas anteriormente
    for(x=0;x<layer_array.length;x++){
      mymap.removeLayer(layer_array[x]);
      layerControl.removeLayer(layer_array[x]);
    }
    layer_array=[];layers_internal

    if(xhr_current_layer && xhr_current_layer.readyState != 4) {
      xhr_current_layer.abort();
    }
    xhr_current_layer = $.ajax({
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

          // genera capa con todos los datos, sin tener en cuenta la intersección con la capa activa
          layer_current = workspace + ":" + layer;

          layerSubProjects = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
            layers: layer_current, //nombre de la capa (ver get capabilities)
            format: 'image/png',
            transparent: 'true',
            opacity: 1,
            version: '1.0.0', //wms version (ver get capabilities)
            tiled: true,
            maxZoom: 20,
            styles: style,
            env: 'color:' + color_layer,
            INFO_FORMAT: 'application/json',
            format_options: 'callback:getJson',
            CQL_FILTER: cql_filter
          })

          projectsa = layerSubProjects.getLayer(layer_current);
          layerControl.addOverlay(projectsa, layer, null, {
            sortLayers: true
          });
          //genera Modal de capas internas
          if(first_time_internal_layers){
            var new_item = 
                    '<div>'+
                    '<a class="dropdown-item d-flex" href="#" style="justify-content:space-between">'+
                    '<div class="d-inline mr-3">'+
                    '<div class="custom-control custom-checkbox" style="display: inline-block;">'+
                    '<input class="custom-control-input" onchange="select_layer()" id="checkbox_'+layer+'" type="checkbox" name="radio_mapabase">'+
                    '<label id="checkboxlabel_'+layer+'" class="string optional control-label custom-control-label" for="checkbox_'+layer+'"> </label>'+
                    '</div>'+
                    '<label for=mapa_base1>'+label_layer+'</label>'+
                    '</div>'+
                    '<div class="custom-control custom-switch d-inline">'+
                    '<input type="checkbox" id="switch_'+layer+'" class="custom-control-input layer_filter_switch" onchange="switch_filtered_layer()">'+
                    '<label id="switchlabel_'+layer+'" class="custom-control-label custom-role-colour" for="switch_'+layer+'">Filtrados</label>'+
                    '</div></a>'+
                    '</div>'

            $('#projects_container').append(new_item);
          }
          layer_array.push(projectsa);

          // genera capa con los datos que se intersectan con la capa activa

          //aplica filtro intercapas para mostrar solo aquellos registros que se intersectan con la capa activa
          var current_layer_filters = Navarra.project_types.config.current_layer_filters.replace(/'/g,"''");
          cql_filter += " and INTERSECTS(the_geom, collectGeometries(queryCollection('" + workspace + ':' + name_layer + "', 'the_geom', '" + current_layer_filters + "')))";

       // genera capa con todos los datos, sin tener en cuenta la intersección con la capa activa
          layer_current_intersect = workspace + ":" + layer;

          layerSubProjects = new MySource(protocol + "//" + url + ":" + port + "/geoserver/wms", {
            layers: layer_current_intersect, //nombre de la capa (ver get capabilities)
            format: 'image/png',
            transparent: 'true',
            opacity: 1,
            version: '1.0.0', //wms version (ver get capabilities)
            tiled: true,
            maxZoom: 20,
            styles: style,
            env: 'color:' + color_layer,
            INFO_FORMAT: 'application/json',
            format_options: 'callback:getJson',
            CQL_FILTER: cql_filter
          })

          projectsa = layerSubProjects.getLayer(layer_current_intersect);
          layerControl.addOverlay(projectsa, layer+ "-filtrados", null, {
            sortLayers: true
          });
          layer_array.push(projectsa);
        }) // Cierra each data
        
        first_time_internal_layers = false;

        //vuelve a checkear las capas anteriormente checkeadas
        var check_layers = document.querySelectorAll('.leaflet-control-layers-selector');
        for(l=0; l<check_layers.length; l++){
          if(check_layers[l].type=='checkbox'){
            var name_layer_project = $(check_layers[l]).next().html().substring(1);
            if(active_internal_layers.indexOf(name_layer_project)>=0){
              check_layers[l].click();
            }
          }
        }
    } // Cierra success
  }) // Cierra ajax
} // Cierra layers_internal


  function layers_external() {
    //Layer outer
    if(xhr_layer_external && xhr_layer_external.readyState != 4) {
      xhr_layer_external.abort();
    }
    xhr_layer_external = $.ajax({
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
            maxZoom: 20,
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
          //genera Modal de capas externas
          var new_item = '<a class="dropdown-item" href="#"><div class="custom-control custom-checkbox" style="display: inline-block;">'+
                    '<input class="custom-control-input" onchange="select_layer()" id="checkbox_'+v.name+'" type="checkbox" name="radio_mapabase">'+
                    '<label class="string optional control-label custom-control-label" for="checkbox_'+v.name+'"> </label>'+
                    '</div>'+
                    '<label for=mapa_base1>'+v.name+'</label></a>';
          $('#externallayers_container').append(new_item);
        })
      }
    })
  }

var project_names=["ArriendosChile","PoligonosChile"];
  function popup() {
    MySource = L.WMS.Source.extend({
      'showFeatureInfo': function(latlng, info) {
        if(latlng["lat"]!=last_lat || latlng["lng"]!=last_long){
          //si hace click en otro punto borra contenedor de popup
          $('#popup_created').empty();
        }
        last_lat=latlng["lat"];
        last_long=latlng["lng"];
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
            var count = 1;

            xhr_popup = $.ajax({
                type: 'GET',
                url: '/project_fields/field_popup.json',
                datatype: 'json',
                data: {
                  project_name: project_name
                },
                success: function(data) {
                  var fields_popup=data["fields_popup"];
                  var div_popup = document.createElement('DIV');
                  div_popup.className="div_popup";
                  var new_p = document.createElement('P');
                  new_p.className="tittle_popup";
                  new_p.innerHTML=data["project_name"];
                  div_popup.appendChild(new_p);

                  Object.keys(fields_popup).forEach(function(value) {
                    label = data["fields_popup"][value];
                    var val = prop[value]
                    // Valida si el valor no es nulo
                    if (val != null && val != 'null') {
                      // Elimina los corchetes y comillas del valor (en caso que contenga)
                      val = val.toString().replace(/\[|\]|\"/g, '');
                      var new_p = document.createElement('P');
                      new_p.className="p_popup"
                      new_p.innerHTML=label + ': ' + val;
                      div_popup.appendChild(new_p);
                    }
                  });
                  var app_id_popup=prop["app_id"];
                  if(Navarra.dashboards.config.name_project==data["project_name"]){
                    var new_p = document.createElement('I');
                    new_p.setAttribute("onclick",'show_item_info('+app_id_popup+',true)');
                    new_p.className="fas fa-info-circle info_icon";
                    div_popup.appendChild(new_p);
                  }

                  var isdifferent=true;
                  //verifica que si se está haciendo click en el mismo punto
                  $(".div_popup").each(function(){
                    if(div_popup.innerHTML==$(this).html()){
                      isdifferent=false;
                    }
                  });
                  if(isdifferent){
                    document.getElementById("popup_created").appendChild(div_popup);
                  }
                  
                  inn = document.getElementById("popup_created").innerHTML;
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
        //  } // Cierra if
        } // Cierra if
      } // Cierra showFeatureInfo
    }); // Cierra L.WMS.Source.extend
  }

function close_all_popups(){
  mymap.closePopup();
}

function get_zoomextent(){
  if(editableLayers.getLayers().length!=0){
    mymap.fitBounds(editableLayers.getBounds());
  } else{
    var project_type_id = Navarra.dashboards.config.project_type_id;
    var attribute_filters = Navarra.project_types.config.attribute_filters;
    var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
    var from_date = Navarra.project_types.config.from_date;
    var to_date = Navarra.project_types.config.to_date;
    $.ajax({
      type: 'GET',
      url: '/project_types/get_extent',
      datatype: 'json',
      data: {
        project_type_id: project_type_id,
        attribute_filters: attribute_filters,
        filtered_form_ids: filtered_form_ids,
        from_date: from_date,
        to_date: to_date
      },
      success: function(data) {
        if(data.data[0].miny==null || data.data[0].minx==null || data.data[0].maxy==null || data.data[0].maxx==null){
          //no hay datos que mostrar
          show_kpis();
          show_data_dashboard();
        } else{
          mymap.fitBounds([[data.data[0].miny, data.data[0].minx],[data.data[0].maxy, data.data[0].maxx]]);
        }
       }
    });
  }
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
    popup: popup,
    close_all_popups: close_all_popups,
    get_zoomextent: get_zoomextent
  }
}();
