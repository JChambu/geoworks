Navarra.namespace("geocoding_ol");
Navarra.geocoding_ol = function (){
  var init= function() {

   var map  = new ol.Map({
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
        center: ol.proj.fromLonLat([-68.8167, -32.8833]),
        zoom: 4
      })
    });
  
    map.addControl(new ol.control.LayerSwitcher({tipLabel: 'Leyenda'}));
    map.addControl(new ol.control.ZoomSlider()); 

  };
  return {
    init: init
  }
}();
