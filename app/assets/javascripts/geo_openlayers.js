Navarra.namespace("geo_openlayers");

Navarra.geo_openlayers = function(){
  var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;

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
      center: [-68.8167, -32.8833],
      zoom: 10
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

  }

  addMarker_op = function(){
    var data_id =  $("#data_id").val();

    $.ajax({
      type: 'GET',
      url: '/project_types/maps.json',
      datatype: 'json',
      data: {data_id: data_id},
      success: function(data){
        $.each(data, function(i,val){

          console.log(val['longitude']);
          if (val['longitude'] != null && val['latitude'] != null){
            coord = [val['longitude'], val['latitude']];

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
            map.getView().setZoom(10);
          }
        })
      },
      error: function(XHR, textStatus, error){
        console.log(error);
      }
    })
  };

  return {
    init: init,
    //    enableMap: enableMap,
    //    latitude_ol: latitude_ol,
    //    longitude_ol: longitude_ol,
    //    line_ol: line_ol

  }
}();
