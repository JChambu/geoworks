Navarra.namespace("geo_openlayers");

Navarra.geo_openlayers = function(){
  var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight, vectorSource, pointLayer, checked_multi, features;
  var geometry_container = [];
  var move_tmp = 0;
  var draw, lastFeature; 
  var featureAll = [];

  var init = function(){

    iconStyle = 
      new ol.style.Style({
        image : new ol.style.Icon(({
          opacity: 1,
          scale: 0.5,
          color: 'gray',
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.6.4/examples/data/dot.png'
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

        checked = $('#select, #create_multi').hasClass('active');
        if (!checked){
          currentSize = map.getView().calculateExtent(map.getSize());
          Navarra.project_types.config.size_box = currentSize;  
          init_chart_doughnut();  
          init_kpi();
        }
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

    map.on('rightclick', function(evt) {
      var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });

      if (feature) {

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
    //



    $('#select').on('click', function(event) {
      checked = $('#select').hasClass('active');
      if (checked){
        $('#select').removeClass('active');
        //Borra el ultimo feature
        //features.remove(lastFeature);
       // map.removeInteraction(draw);

      }else{
        $('#select').addClass('active');
        //funciona la seleccion
        //draw = new ol.interaction.Select();
        //map.addInteraction(draw);
        // fin seleccion
        //modificacions features
        // modifyInteraction();
        //end
      }  
    });

    $('#create_multi').on('click', function(event) {
      
      checked_multi = $('#create_multi').hasClass('active');
      if (checked_multi){
        $('#create_multi').removeClass('active');
        //Borra toda los features
        console.log("Paso");
        map.removeInteraction(draw);
        removeAll();
        geometry_container = [];

        var extent = pointLayer.getSource().getExtent();
        pointLayer.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
          feature.setStyle(iconStyle);            
        });
        
      }else{

        $('#create_multi').addClass('active');
        checked_multi = $('#create_multi').hasClass('active');
        addInteraction();
      }  
    });

    var ssource =  new ol.source.Vector({features: features})

    var featureOverlay = new ol.layer.Vector({
      source: ssource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.8)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      })
    });
    featureOverlay.setMap(map);
  }

  features = new ol.Collection();

  function modifyInteraction(){
    draw = new ol.interaction.Modify({
      features: features
    });



    draw.on('modifyend',function(evt){
      var feat = evt.features.getArray();
      for (var i=0;i<feat.length;i++){

        var mod_polygon = feat[i].getGeometry().getCoordinates();

        $.each(coordinate_polygon, function(i,val){
          geometry_container.push(val); 
        });

        init_kpi(geometry_container);
        init_chart_doughnut(geometry_container);  
        lastFeature = evt.feature;
        featureAll.push(lastFeature);
      }
    })
    map.addInteraction(draw);
  }

  function addInteraction() {

    draw = new ol.interaction.Draw({
      features: features,
      type: 'Polygon'
    });

    var removeLastFeature = function() {
      if (lastFeature)
        features.remove(lastFeature);
    };

    removeAll = function() {
      $.each(featureAll, function(i,val){
        features.remove(val);
      })

      return;
    };

    draw.on('drawstart', function(evt){
      if(!checked_multi == true){
        removeLastFeature(); 
      }
    });
    var fill = new ol.style.Fill({
      color: [180, 0, 0, 0.3]
    });

    var stroke = new ol.style.Stroke({
      color: [180, 0, 0, 1],
      width: 1
    });


    var style_up = new ol.style.Style({
      image: new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: 8
      }),
      fill: fill,
      stroke: stroke
    });

    draw.on('drawend',function(evt){

   //   modifyInteraction();
      //var selectedFeatures = selectInteraction.getFeatures();
      //selectedFeatures.clear();
      extent = evt.feature.getGeometry().getExtent();
      pointLayer.getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
        feature.setStyle(style_up);            
        //console.log(feature.getGeometry().getCoordinates());
      });
      var coordinate_polygon = evt.feature.getGeometry().getCoordinates();
      $.each(coordinate_polygon, function(i,val){
        geometry_container.push(val); 
      });

      init_kpi(geometry_container);
      init_chart_doughnut(geometry_container);  
      lastFeature = evt.feature;
      featureAll.push(lastFeature);
    })

    map.addInteraction(draw);
  }

  // Initialize the interactions
  var selectInteraction = new ol.interaction.Select({
    condition: ol.events.condition.never
  });


  addMarker_op = function(color='black'){
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
          //          var colorMarker = val['color'];
          if (val['longitude'] != null && val['latitude'] != null){
            coord = [val['longitude'], val['latitude']];
            iconGeometry = new ol.geom.Point(coord);
            var iconFeature = new ol.Feature({
              geometry: iconGeometry,
              population: 4000,
              rainfall: 500
            });
            iconFeature.setStyle(iconStyle);

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
      }
    })
  };


  return {
    init: init,
    addMarker_op: addMarker_op,

  }
}();
