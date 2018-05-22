Navarra.namespace("geo_openlayers");

Navarra.geo_openlayers = function(){
  var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight, vectorSource, pointLayer;
  var move_tmp = 0;

  var init = function(){
    iconStyle = new ol.style.Style({
      image : new ol.style.Icon(({
        anchor : [ 0.5, 46 ],
        anchorXUnits : 'fraction',
        anchorYUnits : 'pixels',
        opacity : 0.75,
        src : '/images/marker-1.png'
      }))
    });


    vector = new ol.layer.Vector({ source: new ol.source.Vector()});
    var view =  new ol.View({
      projection: 'EPSG:4326',
      center: [-63.8167, -33.8833],
      extent: [-73.41544, -55.25, -53.62835, -21.83231],
      //minZoom:3,
      zoom: 7
    });

    map  = new ol.Map({
      target: 'map',
      renderer: 'canvas',
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
      ]),
      layers: [
        new ol.layer.Group({
          id:'osm',
          title: 'Mapa Base',
          layers: Navarra.layers.basemaps()
        }),
        vector
      ],
      interactions: ol.interaction.defaults({
        keyboard: false
      }),
      view: view
    });

    addMarker_op();

    var size = map.getView().calculateExtent(map.getSize());
    map.on('moveend', function(){
      if (move_tmp == 1){
        currentSize = map.getView().calculateExtent(map.getSize());
        Navarra.project_types.config.size_box = currentSize;   
        init_chart_doughnut();  
        init_kpi();
      }else{
        move_tmp = 1 ;
      }
    });

    var mousePosition = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(2),
      projection: 'EPSG:4326',
      target: document.getElementById('myposition'),
      undefinedHTML: '&nbsp;'
    });
    map.addControl(mousePosition);

    var element = document.getElementById('popup');
    var popup = new ol.Overlay({
      element: element,
      positioning: 'bottom-center',
      stopEvent: false

    });
    map.addOverlay(popup);
    // display popup on click
    map.on('click', function(evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });

      if (feature) {
        detail = "Num Cliente: "+ feature.get('client_id') + '<br>' ;
        detail += "Estado: "+ feature.get('status') + '<br>' ;
        detail += "Razon Social: " + feature.get("razon_social") + '<br>';
        detail += "Ejecutivo: " + feature.get("ejecutivo")+ '<br>';
        detail += "Contratos: " + feature.get("contratos");

        popup.setPosition(evt.coordinate);
        $(element).popover({
          'animation': true,
          'html': true,
          'content': detail 
        });
        $(element).popover('show');
      } else {
        $(element).popover('destroy');
      }
    });

    // change mouse cursor when over marker
    /* map.on('pointermove', function(e) {
      if (e.dragging) {
        $(element).popover('destroy');
        return;
      }
      var pixel = map.getEventPixel(e.originalEvent);
      var hit = map.hasFeatureAtPixel(pixel);
      map.getTarget().style.cursor = hit ? 'pointer' : '';
    });
    */
    // Add or remove interactions
    $('#select').on('click', function(event) {
      var checked = !$('#select').hasClass('active');
      if(checked) {
        map.addInteraction(selectInteraction);
        map.addInteraction(dragBoxInteraction);
        
      } else {
        map.removeInteraction(selectInteraction);
        map.removeInteraction(dragBoxInteraction);
      }
    });


  }


  // Initialize the interactions
  var selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.never
  });
  var dragBoxInteraction = new ol.interaction.DragBox({
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: [25, 255, 255, 1]
      })
    })
  });
  var source = new ol.source.Vector();
  
  dragBoxInteraction.on('boxend', function(event) {
    //var selectedFeatures = selectInteraction.getFeatures();
    //selectedFeatures.clear();
    var extent = dragBoxInteraction.getGeometry().getExtent();
    init_kpi(extent);
    init_chart_doughnut(extent);
  /*  pointLayer.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
      selectedFeatures.push(feature);
    });*/
    var geom = event.target.getGeometry();
    var feat = new ol.Feature({
      geometry: geom
    });
    source.addFeature(feat);
    select_draw =  new ol.layer.Vector({
      source: source
    })
    map.addLayer(select_draw);
  });


  addMarker_op = function(){
    var size = map.getView().calculateExtent(map.getSize());

    var data_id =  $("#data_id").val();
    var redatos = {};
    redatos['data_id'] =  data_id;

    if (Navarra.project_types.config.filtrado != ''){
      var filters = Navarra.project_types.config.filtrado;
      redatos['provincia'] = filters;  

      map.removeLayer(pointLayer);
    }
    $.ajax({
      type: 'GET',
      url: '/project_types/maps.json',
      datatype: 'json',
      data: redatos,
      success: function(data){
        var feature = [];
        $.each(data, function(i,val){
          var colorMarker = val['color'];
          if (val['longitude'] != null && val['latitude'] != null){
            coord = [val['longitude'], val['latitude']];

            iconGeometry = new ol.geom.Point(coord);

            var iconFeature = new ol.Feature({
              geometry: iconGeometry,
              status: val['status'],
              client_id: val['client_id'],
              razon_social: val['razon_social'],
              ejecutivo: val['ejecutivo'],
              contratos: val['contratos'],
              population: 4000,
              rainfall: 500
            });

            iconFeature.setStyle(
              new ol.style.Style({
                image : new ol.style.Icon(({
                  opacity: 1,
                  scale: 0.5,
                  color: colorMarker,
                  crossOrigin: 'anonymous',
                  src: 'https://openlayers.org/en/v4.6.4/examples/data/dot.png'
                }))
              })
            );
            feature.push(iconFeature);
          }});

        vectorSource = new ol.source.Vector({
          features: feature
        });

        pointLayer = new ol.layer.Vector({
          source: vectorSource
        });
        map.addLayer(pointLayer);
        var extent = pointLayer.getSource().getExtent();
        map.getView().fit(extent, map.getSize());
        //        map.getView().setZoom(10);
        //}})
      },
      error: function(XHR, textStatus, error){
        console.log(error);
      }
    })
  };




  return {
    init: init,
    addMarker_op: addMarker_op,
    //    enableMap: enableMap,
    //    latitude_ol: latitude_ol,
    //    longitude_ol: longitude_ol,
    //    line_ol: line_ol

  }
}();
