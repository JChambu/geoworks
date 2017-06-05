Navarra.namespace("layers.add");
Navarra.namespace("layers.basemaps");

Navarra.layers.basemaps = function(){

  var osmLayer = new ol.layer.Tile({
    title: 'OSM',
    type: 'base',
    visible: 'true',
    opacity: 0.9,
    source: new ol.source.OSM()
  });
  var noneLayer = new ol.layer.Tile({
    title: 'Sin Mapa',
    type: 'base'
  });

  return [noneLayer, osmLayer];

}



Navarra.layers.add  =function() { 
  //*******************Layers localhost**********************//
/*
  var layer_geoserver_tramos =  'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson';
  //var layer_geoserver_geomainid = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:geomanid&maxFeatures=50&outputFormat=application%2Fjson'
  var layer_geoserver_geomainid = 'geoworks_lvh:geomanid';
  var layer_geoserver_manzana = 'geoworks_lvh:manzanas';
  var layer_geoserver_cobertura = 'geoworks_lvh:cobertura';
  var layer_geoserver_new = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_new_geo_editions&maxFeatures=10050&outputFormat=application%2Fjson'
  //    var layer_geoserver_gw_status_desfasaje = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_desfasaje&maxFeatures=50&outputFormat=application%2Fjson'
  var layer_geoserver_gw_status_desfasaje = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_desfasaje&maxFeatures=10050&outputFormat=application%2Fjson'
  var layer_geoserver_gw_status_sin_info = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_sin_info&maxFeatures=10050&outputFormat=application%2Fjson'
  var layer_geoserver_gw_status_posible = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_posible_barrio&maxFeatures=10050&outputFormat=application%2Fjson'
  var layer_geoserver_gw_status_ok = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_ok&maxFeatures=10050&outputFormat=application%2Fjson'

  var url = 'http://localhost:8080/geoserver/wms'
  */
  //*******************Layers Geoworks**********************//
  //    var layer_geoserver_tramos = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson';
  //    var layer_geoserver_geomainid = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:geomanid&maxFeatures=50&outputFormat=application%2Fjson'

   var layer_geoserver_manzana = 'geoworks_supercanal:manzanas';
    var layer_geoserver_geomainid = 'geoworks_supercanal:geomanid';
    var layer_geoserver_cobertura = 'geoworks_supercanal:cobertura';
    var layer_geoserver_new = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:view_new_geo_editions&maxFeatures=10001&outputFormat=application%2Fjson'
    var url = 'http://geoworks.gisworking.com:8080/geoserver/wms'
    var layer_geoserver_gw_status_sin_info = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_sin_info&maxFeatures=10000&outputFormat=application%2Fjson'

    var layer_geoserver_gw_status_desfasaje = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_desfasaje&maxFeatures=10050&outputFormat=application%2Fjson'

    var layer_geoserver_gw_status_posible = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_posible_barrio&maxFeatures=10050&outputFormat=application%2Fjson' 
    var layer_geoserver_gw_status_ok = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_ok&maxFeatures=10050&outputFormat=application%2Fjson'
    var url = 'http://geoworks.gisworking.com:8080/geoserver/wms'

  var vectorSource = new ol.source.Vector();
  /*    var vectorSource_geoserver_tramos = new ol.source.Vector({
      url: layer_geoserver_tramos,
      format: new ol.format.GeoJSON()
    });*/

  var vectorSource_geoserver_tramos_desfasaje = new ol.source.Vector({
    url: layer_geoserver_gw_status_desfasaje,
    format: new ol.format.GeoJSON()
  });

  var vectorSource_geoserver_tramos_sin_info = new ol.source.Vector({
    url: layer_geoserver_gw_status_sin_info,
    format: new ol.format.GeoJSON()
  });

  var vectorSource_geoserver_tramos_posible = new ol.source.Vector({
    url: layer_geoserver_gw_status_posible,
    format: new ol.format.GeoJSON()
  });

  var vectorSource_geoserver_tramos_ok = new ol.source.Vector({
    url: layer_geoserver_gw_status_ok,
    format: new ol.format.GeoJSON()
  });

  var vectorSource_geoserver_geomainid = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_geomainid, VERSION: '1.1.0'} 
  });

  var vectorSource_geoserver_manzana = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_manzana, VERSION: '1.1.0'} 
  });
  var vectorSource_geoserver_cobertura = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_cobertura, VERSION: '1.1.0'} 
  });

  var vectorSource_geoserver_new = new ol.source.Vector({
    url: layer_geoserver_new,
    format: new ol.format.GeoJSON()
  });

/********Styles********/


  var styleSinInfo = function(feature) {
    geometry = feature.getGeometry();
    style_sin_info = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#819FF7',
          width: 2
        }) 
      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);
      //  arrows
      style_sin_info.push(new ol.style.Style({
        geometry: new ol.geom.Point(end),
        image: new ol.style.Icon({
          src: '/images/arrow.png',
          anchor: [0.75, 0.5],
          scale: 0.03,
          rotateWithView: true,
          rotation: -rotation
        })
      }));
    });
    return style_sin_info;
  };

  var styleNew = function(feature) {
    geometry = feature.getGeometry();
    style_new = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#298A08',
          width: 2
        }) 
      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);
      //  arrows
      style_new.push(new ol.style.Style({
        geometry: new ol.geom.Point(end),
        image: new ol.style.Icon({
          src: '/images/arrow.png',
          anchor: [0.75, 0.5],
          scale: 0.03,
          rotateWithView: true,
          rotation: -rotation
        })
      }));
    });
    return style_new;
  };

  var styleOk = function(feature) {
    geometry = feature.getGeometry();
    style_ok = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#82FA58',
          width: 2
        }) 
      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);
      //  arrows
      style_ok.push(new ol.style.Style({
        geometry: new ol.geom.Point(end),
        image: new ol.style.Icon({
          src: '/images/arrow.png',
          anchor: [0.75, 0.5],
          scale: 0.03,
          rotateWithView: true,
          rotation: -rotation
        })
      }));
    });
    return style_ok;
  };

  var stylePosibleBarrio = function(feature) {
    geometry = feature.getGeometry();
    style_posible = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FA5858',
          width: 2
        }) 
      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);
      //  arrows
      style_posible.push(new ol.style.Style({
        geometry: new ol.geom.Point(end),
        image: new ol.style.Icon({
          src: '/images/arrow.png',
          anchor: [0.75, 0.5],
          scale: 0.03,
          rotateWithView: true,
          rotation: -rotation
        })
      }));
    });
    return style_posible;
  };
  
  var styleDesfasaje = function(feature) {
    geometry = feature.getGeometry();
    style_desfasaje = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#FACC2E',
          width: 2
        }) 
      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);
      //  arrows
      style_desfasaje.push(new ol.style.Style({
        geometry: new ol.geom.Point(end),
        image: new ol.style.Icon({
          src: '/images/arrow.png',
          anchor: [0.75, 0.5],
          scale: 0.03,
          rotateWithView: true,
          rotation: -rotation
        })
      }));
    });
    return style_desfasaje;
  };
  

  /*
    var vectorLayer = new ol.layer.Vector({
      title:'Supercanal - Rojo',
      type: 'overlays',
      source: vectorSource_geoserver_tramos,
      style: style_segment,
      visible: 'false'
    });*/

  var vectorLayerGeomainid = new ol.layer.Tile({
    title:'GeomainID',
    type: 'overlays',
    source: vectorSource_geoserver_geomainid
  });

  var vectorLayerSinInfo = new ol.layer.Vector({
    title:'Gw status_Sin_Info',
    type: 'overlays',
    source:vectorSource_geoserver_tramos_sin_info,
    style: styleSinInfo
  });

  var vectorLayerPosible = new ol.layer.Vector({
    title:'Gw status_Posible_Barrio',
    type: 'overlays',
    source:vectorSource_geoserver_tramos_posible,
    style: stylePosibleBarrio
  });

  var vectorLayerOk = new ol.layer.Vector({
    title:'Gw status_Ok',
    type: 'overlays',
    source: vectorSource_geoserver_tramos_ok,
    style: styleOk
  });

  var vectorLayerDesfasaje = new ol.layer.Vector({
    title:'Gw status_desfasaje',
    type: 'overlays',
    source:vectorSource_geoserver_tramos_desfasaje,
    style: styleDesfasaje
  });

  var vectorLayerManzana = new ol.layer.Tile({
    title:'Centroi Manzana',
    type: 'overlays',
    source: vectorSource_geoserver_manzana
  });

  var vectorLayerCobertura = new ol.layer.Tile({
    title:'Cobertura',
    type: 'overlays',
    opacity: 0.4,
    visible: 'false',
    source: vectorSource_geoserver_cobertura
  });

  var vectorLayerNew = new ol.layer.Vector({
    title:'Segmentos nuevos',
    type: 'overlays',
    source: vectorSource_geoserver_new,
    style: styleNew
  });

  return [
    vectorLayerCobertura, vectorLayerGeomainid, vectorLayerManzana,  vectorLayerNew,  vectorLayerDesfasaje, vectorLayerSinInfo, vectorLayerPosible, vectorLayerOk ];

}

