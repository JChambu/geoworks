Navarra.namespace("geocoding_ol");

Navarra.geocoding_ol.config = {
  'line':[]
}


Navarra.geocoding_ol = function (){
  var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle;
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
    var layer_geoserver = 'geoworks_lvh:view_geo_editions';
    var vectorSource = new ol.source.Vector({
     // url: 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson',
      url: 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/wms?service=WMS&version=1.1.0&request=GetMap&layers=geoworks_supercanal:view_geo_editions&styles=&bbox=-68.94052863,-68.831688,-32.864848,-32.766603&width=768&height=767&srs=EPSG:4326&format=application/openlayers',
  //    url: 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson',
      format: new ol.format.GeoJSON()
    });

    var vectorLayer = new ol.layer.Vector({
      title:'Geo Edicion',
      type: 'overlays',
      source: vectorSource
    })
    var osmLayer = new ol.layer.Tile({
      title: 'OSM',
      type: 'base',
      visible: 'true',
      source: new ol.source.OSM()
    });

    vector = new ol.layer.Vector({ source: new ol.source.Vector()});

    var view =  new ol.View({
      projection: 'EPSG:4326',
      center: [-68.8167, -32.8833],
      zoom: 10
    })

    map  = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Group({
          id:'osm',
          title: 'Mapa Base',
          layers: [
            osmLayer
          ]
        }),
        new ol.layer.Group({
          id: 'Layers',
          title: 'Capas',
          layers:[
            vectorLayer
          ]
        }),
        vector
      ],
      //osmLayer, vectorLayer],
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
          width: 2
        }) })
    });

    var highlight;
    var displayFeatureInfo = function(pixel) {
      var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        return feature;
      });
      var info = document.getElementById('info');
      if (feature) {
        info.innerHTML = feature.get('id') + ': ' + feature.get('street');
      } else {
        info.innerHTML = '&nbsp;';
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

    /* onMouseMove = function(browserEvent){
      var coordinate = browserEvent.coordinate;
      var pixel = map.getPixelFromCoordinate(coordinate);
      var el = document.getElementById('info');
      el.innerHTML = '';
      map.forEachFeatureAtPixel(pixel, function(feature) {
        featureOverlay.addFeature(feature);
        el.innerHTML += feature.get('street') + feature.get('id') + '<br>';
      });

    }
    map.on('pointermove', onMouseMove);*/

    map.on('pointermove', function(evt) {
      
      if (evt.dragging) {
        return;
      }
      var pixel = map.getEventPixel(evt.originalEvent);
      displayFeatureInfo(pixel);
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

        $("#geo_edition_id").attr("value", feature.get('id'));
        $("#geo_edition_name").attr("value", feature.get('name'));
        $("#geo_edition_street").attr("value", feature.get('street'));
        $("#geo_edition_number_door_start_original").attr("value", feature.get('number_door_start_original'));
        $("#geo_edition_number_door_end_original").attr("value", feature.get('number_door_end_original'));
        $("#geo_edition_code").attr("value", feature.get('code'));
      } 
    });

    //Main Control Bar
    /* Nested toobar with one control activated at once */
    //  nested = new ol.control.Bar({ toggleOne: true, group:false });
    //  mainbar.addControl (nested);
    //    selectCtrl();
    //    pedit();
    //    ledit();

      if (Navarra.geo_editions.config.line)
    {
      str = Navarra.geo_editions.config.line[0];
      coorde = str.split(',');
        lat = coorde[0];
      
        console.log(lat);
        coordi = [coorde[1],coorde[0]];
      console.log(coordi);
        addMarker_ol(coordi) ;
    }
//enableMap();

/*
    if (!Navarra.geocoding_ol.longitude_ol){
      return;
    }else{
      addMarker_ol([Navarra.geocoding_ol.longitude_ol, Navarra.geocoding_ol.latitude_ol]); 
    }
  
*/
  
    mainbar = new ol.control.Bar();
    map.addControl(mainbar);
    edit_ol();
    bar_ol();
  
  
  
  };

  //Edit control bar 

  var edit_ol = function(){ 
    editbar = new ol.control.Bar(
      {toggleOne: true,// one control active at the same time
        group:false// group controls together
      });
    mainbar.addControl(editbar);
  }

  // Add selection tool:
  //  1- a toggle control with a select interaction
  //  2- an option bar to delete / get information on the selected feature

  var bar_ol = function(){

    selectCtrl =  new ol.control.Toggle(
      {html: '<i class="fa fa-hand-pointer-o"></i>',
        title: "Select",
        interaction: new ol.interaction.Select(),
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
      interaction: new ol.interaction.Draw
      ({type: 'LineString',
        source: vector.getSource(),
        maxPoints:2 
      }),
      onToggle: function(){
       coordAdd = [];
        map.on('singleclick', function(evt){
          coord = evt.coordinate[0] + " " + evt.coordinate[1];
          coordAdd.push(coord);
          console.log(coordAdd.length);
      if (coordAdd.length == 2  ){
     console.log(coordAdd);
      $('#geo_edition_line').attr("value", coordAdd);
        coordAdd = [];
        }

        });

      }
    })
    editbar.addControl(ledit);
  }

  var load_subdomain = function(){
    var regexParse = new RegExp('([a-z][^.]+).*');
    var domain = document.domain;
    subdomain = regexParse.exec(domain);
  }

    var enableMap = function(){ 


  //console.log(isEnabled)

    map.on('singleclick', function(evt) {


  console.log(evt.coordinate);

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


  //console.log(coordsAdd);
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

  /* var doGeocode = function(opt){
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
  /* $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, function(data){
      var items = [];
      $.each(data, function(key, val) {
        coord = [val.lon, val.lat]
        addMarker_ol(coord);
      });
    });
  }

  var  removeAllMarkers =  function(){
    map.getLayers().item(0).getSource().clear();
  }*/

  return {
    init: init
    //    doGeocode: doGeocode,
    //    enableMap: enableMap,
    //    latitude_ol: latitude_ol,
    //    longitude_ol: longitude_ol,
    //    line_ol: line_ol

  }
}();
