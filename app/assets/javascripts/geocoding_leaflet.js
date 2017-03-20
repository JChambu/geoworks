Navarra.namespace("geocoding_ol");
Navarra.geocoding_ol = function (){
  
  var geocodeServiceUrl = "http://nominatim.openstreetmap.org/search";
  var map;
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
      self.iconGeometry = new ol.geom.Point(evt.coordinate);
      var iconFeature = new ol.Feature({
        geometry: self.iconGeometry
      });

      iconFeature.setStyle(iconStyle);

      var vectorSource = new ol.source.Vector({
        features: [iconFeature]
      });
      self.dinamicPinLayer = new ol.layer.Vector({
        source: vectorSource
      });
      map.addLayer(self.dinamicPinLayer); 
    });
  };

  var doGeocode = function(opt){

    //removeAllMarkers();
    address = opt.county + " " +  opt.location +" " +  opt.searchTerm 
    //address = "Ciudad Autónoma de Buenos Aires Villa Devoto pareja 4230";

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, function(data){
      var items = [];
      $.each(data, function(key, val) {

        iconGeometry = new ol.geom.Point([val.lon, val.lat]);
        

        var iconFeature = new ol.Feature({
          geometry: iconGeometry
        });

        iconFeature.setStyle(iconStyle);

        var vectorSource = new ol.source.Vector({
          features: [iconFeature]
        });
        dinamicPinLayer = new ol.layer.Vector({
          source: vectorSource
        });
        map.addLayer(dinamicPinLayer);
        map.getView().setCenter([val.lon, val.lat]);
      });

    });
  }

 var  removeAllMarkers =  function()  
  {
      map.getLayers().item(1).getSource().clear();
  }
 
  return {
    init: init,
    doGeocode: doGeocode
  }
}();
