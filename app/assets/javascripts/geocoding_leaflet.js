Navarra.namespace("geocoding_ol");
Navarra.geocoding_ol = function (){

  var geocodeServiceUrl = "http://nominatim.openstreetmap.org/search";
  var map;
  var vectorSource; 
  var pointLayer;   
  var init= function() {

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
              title: 'Base',
              type: 'base',
              visible: 'true',
              source: new ol.source.OSM()
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
                params: {LAYERS: 'geoworks:pois', VERSION: '1.1.0'}
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
  };


  var addMarker = function(coord){

    map.removeLayer(pointLayer);

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

        Navarra.geocoding.latitude = val.lat;
        Navarra.geocoding.longitude = val.lon;
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
