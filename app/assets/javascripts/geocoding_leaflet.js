Navarra.namespace("geocoding_ol");
Navarra.geocoding_ol = function (){

  var geocodeServiceUrl = "http://nominatim.openstreetmap.org/search";
  var map;
  var vectorSource; 
  var pointLayer;  
  var subdomain;



  var init= function() {

    var regexParse = new RegExp('([a-z][^.]+).*');
    var domain = document.domain;
     subdomain = regexParse.exec(domain);
    
  var layer_pois = 'geoworks_'+ subdomain[1] + ':pois';
   

var appId = 'ZTVBhWvg8dw4GhrG9fcL';
          var appCode = 'jOEPEj4JkZvbAiv7GP0E2A';
          var hereLayers = [
                    {
                                base: 'base',
                                type: 'maptile',
                                scheme: 'normal.day',
                                app_id: appId,
                                app_code: appCode
                              }]

      var urlTpl = 'https://{1-4}.{base}.maps.cit.api.here.com' +
              '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
              '?app_id={app_id}&app_code={app_code}&useCIT=true&useHTTPS=true';
    
            
            
            vectorSource = new ol.source.Vector();

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
              title: 'OSM',
              type: 'base',
              visible: 'true',
              source: new ol.source.OSM()
            }),

            new ol.layer.Tile({
              title: 'Here',
              type: 'base',
              visible: 'false',
              source: new ol.source.XYZ({
                url: createUrl(urlTpl, hereLayers[0]),
                      attributions: 'Map Tiles &copy; ' + new Date().getFullYear() + ' ' +
                        '<a href="http://developer.here.com">HERE</a>'
                    })
            })
          ]
        }),

        new ol.layer.Group({
          title: 'pois',
          layers: [
            new ol.layer.Tile({
              title: 'pois',
              type: 'overlays',
              source: new ol.source.TileWMS({
                url: 'http://localhost:8080/geoserver/wms',
                params: {LAYERS: layer_pois, VERSION: '1.1.0'}
              })
            })
          ]
        })
      ],

      view: new ol.View({
        projection: 'EPSG:4326',
        center: [-68.8167, -32.8833],
        zoom: 10
      })
    });

    map.addControl(new ol.control.LayerSwitcher({tipLabel: 'Leyenda'}));
    map.addControl(new ol.control.ZoomSlider()); 

    map.on('singleclick', function(evt) {


      addMarker(evt.coordinate);

    });
  
  function createUrl(tpl, layerDesc) {
            return tpl
              .replace('{base}', layerDesc.base)
              .replace('{type}', layerDesc.type)
              .replace('{scheme}', layerDesc.scheme)
              .replace('{app_id}', layerDesc.app_id)
              .replace('{app_code}', layerDesc.app_code);
          }
  
  };


  var addMarker = function(coord){

    map.removeLayer(pointLayer);
        Navarra.geocoding.latitude = coord[1];
        Navarra.geocoding.longitude = coord[0];
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

  var doGeocode = function(opt){
    //removeAllMarkers();
    address = opt.county + " " +  opt.location +" " +  opt.searchTerm 
    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, function(data){
      var items = [];
      $.each(data, function(key, val) {

        
        coord = [val.lon, val.lat]

        addMarker(coord);

      });

    });
  }

  var  removeAllMarkers =  function()  
  {
    map.getLayers().item(0).getSource().clear();
  }

  return {
    init: init,
    doGeocode: doGeocode
  }
}();
