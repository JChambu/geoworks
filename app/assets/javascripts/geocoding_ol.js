Navarra.namespace("geocoding_ol");
var map;
Navarra.geocoding_ol = function (){

  var geocodeServiceUrl = "http://nominatim.openstreetmap.org/search";
  var vectorSource; 
  var pointLayer;  
  var subdomain;
  var  appId = 'ZTVBhWvg8dw4GhrG9fcL';
  var  appCode = 'jOEPEj4JkZvbAiv7GP0E2A';
  var latitude_ol;
  var longitude_ol;
  var nested;
  var mainbar;
  var vector;
  var line_ol;

  var init= function() {

    load_subdomain();
    var layer_pois = 'geoworks_'+ subdomain[1] + ':view_pois';
    var layer_geo_editions = 'geoworks_'+ subdomain[1] + ':view_geo_editions';
    console.log(layer_pois);
    var hereLayers = [{
      base: 'base',
      type: 'maptile',
      scheme: 'normal.day',
      app_id: appId,
      app_code: appCode
    }]

    var urlTpl = 'https://{1-4}.{base}.maps.cit.api.here.com' +
      '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
      '?app_id={app_id}&app_code={app_code}&useCIT=true&useHTTPS=true';

    vector = new ol.layer.Vector({ source: new ol.source.Vector()});
    iconStyle = new ol.style.Style({
      image : new ol.style.Icon(({
        anchor : [ 0.5, 46 ],
        anchorXUnits : 'fraction',
        anchorYUnits : 'pixels',
        opacity : 0.75,
        src : '/images/marker-1.png'
      }))
    });

    var arg =  ol.proj.transform([-68.8167, -32.8833], 'EPSG:3857', 'EPSG:4326');
    var projection = new ol.proj.Projection({
      code: 'EPSG:4326',
      units: 'm'
    });

    map  = new ol.Map({
      target: 'map',
      layers: [ 
        new ol.layer.Group({
          'title': 'Base Maps',
          layers: [
            new ol.layer.Tile({
              title: 'Here',
              type: 'base',
              visible: 'false',
              source: new ol.source.XYZ({
                url: createUrl(urlTpl, hereLayers[0]),
                attributions: 'Map Tiles &copy; ' + new Date().getFullYear() + ' ' +
                '<a href="http://developer.here.com">HERE</a>'
              })
            }), 
            new ol.layer.Tile({
              title: 'OSM',
              type: 'base',
              visible: 'true',
              source: new ol.source.OSM()
            })
          ]
        }),

        new ol.layer.Group({
          title: 'geo_editions',
          layers: [
            new ol.layer.Tile({
              title: 'geo_editions',
              type: 'overlays',
              source: new ol.source.TileWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: {LAYERS: layer_geo_editions, VERSION: '1.1.0'}
              })
            })
          ]
        })
      , vector],

      view: new ol.View({
        projection: 'EPSG:4326',
        center: [-68.8167, -32.8833],
        zoom: 10
      })
    });

    map.addControl(new ol.control.LayerSwitcher({tipLabel: 'Leyenda'}));
    map.addControl(new ol.control.ZoomSlider());
    var mainbar = new ol.control.Bar();
    map.addControl(mainbar);
    /* Nested toobar with one control activated at once */
    nested = new ol.control.Bar({ toggleOne: true, group:true });
    mainbar.addControl (nested);
    selectCtrl();
    pedit();
    ledit();

    if (!Navarra.geocoding_ol.longitude_ol){
      return;
    }else{
      addMarker_ol([Navarra.geocoding_ol.longitude_ol, Navarra.geocoding_ol.latitude_ol]); 
    }
  };

    selectCtrl =function() { 
       select_c =  new ol.control.Toggle(
      {html: '<i class="fa fa-hand-pointer-o"></i>',
        className: "select",
        title: "Select",
        interaction: new ol.interaction.Select(),
        active:true,
      });

    nested.addControl(select_c);}

    var pedit = function(e) {
      map.removeLayer(pointLayer);
//      Navarra.geocoding_ol.latitude_ol = coord[1];
  //    Navarra.geocoding_ol.longitude_ol = coord[0];
      
      drawPoint = new ol.control.Toggle(
      {html: '<i class="fa fa-map-marker" ></i>',
        className: "edit",
        title: 'Point',
        onToggle: function(evt){
            enableMap(evt);
        }
      });
    nested.addControl(drawPoint);

    } 


    var ledit = function(e) {
//      map.removeLayer(pointLayer);
  //    Navarra.geocoding_ol.latitude_ol = coord[1];
    //  Navarra.geocoding_ol.longitude_ol = coord[0];
      
      drawLine = new ol.control.Toggle(
      {
        html: '<i class="fa fa-share-alt" ></i>',
        className: "edit",
        title: 'LineString',
   /*     interaction: new ol.interaction.Draw
        ({type: 'lineString',
          source: vector.getSource(),
        }),*/

        onToggle: function(evt){
            drawLineStringPolygon(evt);
        }
      });
    nested.addControl(drawLine);
    } 

  var createUrl =  function(tpl, layerDesc) {
      return tpl
        .replace('{base}', layerDesc.base)
        .replace('{type}', layerDesc.type)
        .replace('{scheme}', layerDesc.scheme)
        .replace('{app_id}', layerDesc.app_id)
        .replace('{app_code}', layerDesc.app_code);
    };

  var load_subdomain = function(){
    var regexParse = new RegExp('([a-z][^.]+).*');
    var domain = document.domain;
    subdomain = regexParse.exec(domain);
  }

  var enableMap = function(isEnabled){ 

    console.log(isEnabled)
    if (isEnabled == false){
      console.log("a");
      event.preventDefault();
      return;
    }
    
    map.on('singleclick', function(evt) {
      
      console.log(evt.coordinate);
      
      addMarker_ol(evt.coordinate);
    });
  },

    addMarker_ol = function(coord){
            map.removeLayer(pointLayer);
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


  drawLineStringPolygon = function(isEnabled){

    if (isEnabled === false){
      return false;
    }
    source = new ol.source.Vector();
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


      console.log(coordsAdd);
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
        return styles;
      }
    };
    vector = new ol.layer.Vector({
      source: source,
      style: styleFunction
    });


    map.addInteraction(new ol.interaction.Draw({
      source: source,
      type: /** @type {ol.geom.GeometryType} */ ('LineString'),
      maxPoints:2 
    }));

    map.addLayer(vector);
  }

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
    doGeocode: doGeocode,
    enableMap: enableMap,
    latitude_ol: latitude_ol,
    longitude_ol: longitude_ol,
    line_ol: line_ol

  }
}();
