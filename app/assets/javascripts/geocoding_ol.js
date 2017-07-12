Navarra.namespace("geocoding_ol");

Navarra.geocoding_ol.config = {
  'line':[]
}

Navarra.geocoding_ol = function (){
  var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;
  var init= function() {

    iconStyle = new ol.style.Style({
      image : new ol.style.Icon(({
        anchor : [ 0.5, 46 ],
        anchorXUnits : 'fraction',
        anchorYUnits : 'pixels',
        opacity : 0.75,
        src : '/images/marker-1.png'
      }))
    });

    //     info = document.getElementById('info');
    container = document.getElementById('popup');
    content = document.getElementById('popup-content');

    popup = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: container,
      // autoPan: true,
      stopEvent: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

    vector = new ol.layer.Vector({ source: new ol.source.Vector()});

    var view =  new ol.View({
      projection: 'EPSG:4326',
      center: [-68.8167, -32.8833],
      zoom: 10
    });

    map  = new ol.Map({
      target: 'map',
      controls: ol.control.defaults().extend([
        new ol.control.FullScreen()
      ]),
      layers: [
        new ol.layer.Group({
          id:'osm',
          title: 'Mapa Base',
          layers: Navarra.layers.basemaps()
        }),
        new ol.layer.Group({
          id: 'Layers',
          title: 'Capas',
          layers: Navarra.layers.add()
        }),
        vector
      ],
      interactions: ol.interaction.defaults({
        keyboard: false
      }),
      view: view
    });
    map.addControl(new ol.control.LayerSwitcher({tipLabel: 'Leyenda'}));
    map.addControl(new ol.control.ZoomSlider());

    featureOverlay = new ol.layer.Vector({
      source: new ol.source.Vector(), 
      map: map,
      style: 
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'red',
          width: 6
        }) })
    });

    map.addOverlay(popup);
    map.on('pointermove', function(evt) {

      var coordinate = evt.coordinate;
      content.innerHTML = '&nbsp;';
      container.style.display = 'none';
      var ints = map.getInteractions();
      for(var interaction in ints){
        // console.log(interaction.addEventListener);
      }
      if (evt.dragging)  {
        return;
      }
      var pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel , coordinate);
    });

    map.on('click', function(evt) {
      if (evt.dragging) {
        return;
      }
      var pixel = map.getEventPixel(evt.originalEvent);
      feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
      });


      if (feature) {
        console.log(feature.get('poi_status_id'));
        $("#geo_edition_id").attr("value", feature.get('id'));
        $("#geo_edition_name").attr("value", feature.get('name'));
        $("#geo_edition_street").attr("value", feature.get('street'));
        $("#geo_edition_number_door_start_original").attr("value", feature.get('number_door_start_original'));
        $("#geo_edition_number_door_end_original").attr("value", feature.get('number_door_end_original'));
        $("#geo_edition_code").attr("value", feature.get('code'));
        $("#geo_edition_gw_code").attr("value", feature.get('gw_code'));
        $("#geo_edition_gw_street").attr("value", feature.get('gw_street'));
        $("#geo_edition_gw_pta_ini").attr("value", feature.get('gw_pta_ini'));
        $("#geo_edition_gw_pta_fin").attr("value", feature.get('gw_pta_fin'));
        $("#geo_edition_gw_paridad").attr("value", feature.get('gw_paridad'));
        $("#geo_edition_observations").val( feature.get('observations'));
        $("#geo_edition_poi_status_id").val( feature.get('poi_status_id'));
        $("#geo_edition_paridad").val( feature.get('paridad'));
      } 
    });

    if (Navarra.geo_editions.config.line != "")
    {
      str = Navarra.geo_editions.config.line[0];
      coorde = str.split(',');
      lat = coorde[0];
      coordi = [coorde[1],coorde[0]];
      addMarker_ol(coordi) ;
    }

    mainbar = new ol.control.Bar();
    map.addControl(mainbar);
    edit_ol();
    bar_ol();
  };


  var updateMap = function(){

   map.getLayers().forEach(function (layer) {
         map.removeLayer(layer);
   });
   
   map.getLayers().forEach(function (layer) {
         map.removeLayer(layer);
   });
      group1=  new ol.layer.Group({
          id:'osm',
          title: 'Mapa Base',
          layers: Navarra.layers.basemaps()
        }),
  
  group2 =  new ol.layer.Group({
          id: 'Layers',
          title: 'Capas',
          layers: Navarra.layers.add()
        }),
    
      map.addLayer(group1);
      map.addLayer(group2);
      map.addLayer(vector);
  }


  var displayFeatureInfo = function(pixel, coordinate) {

    content.innerHTML = '&nbsp;';
    container.style.display = 'none';
    var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
      return feature;
    });
    if (feature) {

      container.style.display = 'block';
      information = 'Street: '+ feature.get('street') + '<br/>' ;
      information += 'Inicio: '+ feature.get('number_door_start_original') + ' Fin: ' + feature.get('number_door_end_original') + '<br/>';
      information += 'Obs: ' + feature.get('gw_status') + '<br/>';
      information += 'Code: ' + feature.get('code');
      //information += '<a href="#" data-action="yes">Yes</a>, <a href="#" data-action="no">No</a>';
      content.innerHTML = information;
      popup.setPosition(coordinate);

    } else {
      content.innerHTML = '&nbsp;';
      container.style.display = 'none';

    }
    if (feature !== highlight) {
      if (highlight) {
        featureOverlay.getSource().removeFeature(highlight);
      }
      if (feature) {
        featureOverlay.getSource().addFeature(feature);
      }
      highlight = feature;
    }
  };
  var edit_ol = function(){ 
    editbar = new ol.control.Bar(
      {toggleOne: true,// one control active at the same time
        group:false// group controls together
      });
    mainbar.addControl(editbar);
  }
  var sbar = new ol.control.Bar();

  sbar.addControl (new ol.control.TextButton(
    {html: '<i class="fa fa-times"></i>',
      title: "Delete",
      handleClick: function() 
      {
        var features = selectCtrl.getInteraction().getFeatures();
        if (  !features.getLength()) info("Select an object first...");
        else info(features.getLength()+" object(s) deleted.");
        for (var i=0, f; f=features.item(i); i++) 
        {vector.getSource().removeFeature(f);
        }
        selectCtrl.getInteraction().getFeatures().clear();
      }
    }));
  var  info = function(i){
    {
      $("#info").html(i||"");
    }
  }
  
  var bar_ol = function(){
    selectCtrl =  new ol.control.Toggle(
      {
        html: '<i class="fa fa-hand-pointer-o"></i>',
        title: "Select",
        interaction: new ol.interaction.Select(),
        onToggle: function(active){
          if (active){
            map.removeInteraction(draw); 
          }
        },
        bar: sbar,
        active:true
      });
    editbar.addControl(selectCtrl);
    // Add editing tools

    pedit =     new ol.control.Toggle({
      html: '<i class="fa fa-map-marker" ></i>',
      title: 'Pointoos',
      interaction: new ol.interaction.Draw
      ({type: 'Point',
        source: vector.getSource(),
      })
    });

    editbar.addControl(pedit);
    ledit =   new ol.control.Toggle({
      html: '<i class="fa fa-share-alt" ></i>',
      title: 'LineString',
       /*interaction: new ol.interaction.Draw
      ({type: 'LineString',
        source: vector.getSource(),
        maxPoints:2 
      }),*/
      onToggle: function(active){ 
        buttonActive = "LineString";
        //map.removeInteraction(draw);
        addInteraction();
      }
     /*  onToggle: function(active){
       console.log(vector);
        coordAdd = [];
        map.on('singleclick', function(evt){
          coord = evt.coordinate[0] + " " + evt.coordinate[1];
          coordAdd.push(coord);

            if (coordAdd.length == 2  ){
          console.log(coordAdd);
              $('#geo_edition_line').attr("value", coordAdd);
              coordAdd.length = 0;
            }
        });
      }*/
    })
    editbar.addControl(ledit);
  }


  var addInteraction = function(){
      var type = buttonActive;
      draw = new ol.interaction.Draw({
        source: vector.getSource(),
        type: /** @type {ol.geom.GeometryType} */ (type),
        maxPoints:2, 
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)'
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)'
            })
          })
        })
      });
      map.addInteraction(draw);

      //createMeasureTooltip();
     // createHelpTooltip();

      var listener;
    var geom;

      draw.on('drawstart',function(evt){
        //set sketch
        sketch = evt.feature;
        
        /** @type {ol.Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;
        listener = sketch.getGeometry().on('change', function(evt){
          geom = evt.target;
          var output;
          if (geom instanceof ol.geom.Polygon){
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          }else if(geom instanceof ol.geom.LineString){
            ///output = formatLength(geom);

            tooltipCoord = geom.getLastCoordinate();
          }
        });
      }, this);

      draw.on('drawend',function(){
      //  measureTooltipElement.className = 'tooltip tooltip-static';
      //  measureTooltip.setOffset([0, -7]);
        // unset sketch
        var coordAdd = [];
        coordFirst =  geom.getFirstCoordinate()[0] + " " +  geom.getFirstCoordinate()[1];
        coordLast =  geom.getLastCoordinate()[0] + " " +  geom.getLastCoordinate()[1];
        coordAdd.push(coordFirst);      
        coordAdd.push(coordLast);      
       console.log(coordAdd); 
        
        $('#geo_edition_line').val( coordAdd);
        
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
      //  createMeasureTooltip();
        ol.Observable.unByKey(listener);
      }, this);   
    }


  var load_subdomain = function(){
    var regexParse = new RegExp('([a-z][^.]+).*');
    var domain = document.domain;
    subdomain = regexParse.exec(domain);
    console.log(subdomain[0]);
    console.log(domain);
    return subdomain[0];
  }

  var enableMap = function(){ 
    map.on('singleclick', function(evt) {
      addMarker_ol(evt.coordinate);
    });
  },

    addMarker_ol = function(coord){
      //    map.removeLayer(pointLayer);
      Navarra.geocoding_ol.latitude_ol = coord[1];
      Navarra.geocoding_ol.longitude_ol = coord[0];
      iconGeometry = new ol.geom.Point(coord);
      var iconFeature = new ol.Feature({
        geometry: iconGeometry
      });
      iconFeature.setStyle(iconStyle);
      var vectorSource = new ol.source.Vector({
        features: [iconFeature]
      });
      pointLayer = new ol.layer.Vector({
        source: vectorSource
      });
      map.addLayer(pointLayer);
      var extent = pointLayer.getSource().getExtent();
      map.getView().fit(extent, map.getSize());
      map.getView().setZoom(18);
    };


  /*drawLineStringPolygon = function(){

  /*  if (isEnabled === false){
      return false;
    }*/
  /*  source = new ol.source.Vector();
    styleFunction = function(feature) {
      geometry = feature.getGeometry();
      coordinates = geometry.getCoordinates();
      var coordsAdd = [];
      for (var i=0;i<coordinates.length;i++){ 
        latitud = coordinates[i][0];
        longitud = coordinates[i][1];
        cordLatLon = longitud + " " + latitud
        coordsAdd.push(cordLatLon );
      }

      $('#geo_edition_line').attr("value", coordsAdd);


      geomType = geometry.getType();
      styles = [
  //linestring
        new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
          })
        })
      ];

  if (geomType === 'Polygon'){
    var linerings = geometry.getLinearRings();
    var coordinates = linerings[0].getCoordinates();
    for (var i=1;i<linerings.length;i++){ 
      var coordsToAdd = linerings[i].getCoordinates();
      for (var f=0;f<coordsToAdd.length;f++){
        coordinates.push(coordsToAdd[f]);   
      }
    }
    //      return new ol.geom.MultiPoint(coordinates);
  }else{
    /*geometry.forEachSegment(function(start, end) {
          var dx = end[0] - start[0];
          var dy = end[1] - start[1];
          var rotation = Math.atan2(dy, dx);
    // arrows
          styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
          }));
        });
        */
    /*    return styles;
      }
    };
    vector = new ol.layer.Vector({
      source: source,
      style: styleFunction
    });

*/
    /*  map.addInteraction(new ol.interaction.Draw({
      source: source,
      type: /** @type {ol.geom.GeometryType} */ //('LineString'),
    /*  maxPoints:2 
    }));

    map.addLayer(vector);
  }*/

     var doGeocode = function(opt){
    //removeAllMarkers();
    address = opt.county + " " +  opt.location +" " +  opt.searchTerm
    /*Geocoder Here*/ 
    /* $.getJSON('https://geocoder.cit.api.here.com/6.2/geocode.json?searchtext=' + address + '&app_id=' + appId + '&app_code='+ appCode +'&gen=8' , function(data){
      var items = [];
      $.each(data, function(key, val) {
       latitude = val.View[0].Result[0].Location.DisplayPosition.Latitude;
       longitude = val.View[0].Result[0].Location.DisplayPosition.Longitude;
        coord= [longitude, latitude];
        addMarker_ol(coord);
      });
    });*/
     $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, function(data){
      var items = [];
      $.each(data, function(key, val) {
        coord = [val.lon, val.lat]
        addMarker_ol(coord);
      });
    });
  }

  var  removeAllMarkers =  function(){
    map.getLayers().item(0).getSource().clear();
  }

    return {
      init: init,
      load_subdomain: load_subdomain,
          doGeocode: doGeocode,
      updateMap: updateMap
      //    enableMap: enableMap,
      //    latitude_ol: latitude_ol,
      //    longitude_ol: longitude_ol,
      //    line_ol: line_ol

    }
  }();
