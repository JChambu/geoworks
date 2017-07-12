Navarra.namespace("layers.add");
Navarra.namespace("layers.basemaps");
Navarra.namespace("layers.urls");
Navarra.namespace("layers.vectorSources");
Navarra.namespace("layers.vectorLayers");

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


var filter, subdomain 
var  vectorLayerSinInfo,  vectorLayerRevisar,  vectorLayerPosible,  vectorLayerOk,   vectorLayerDesfasaje, vectorLayerManzana, vectorLayerCoberturaBar, vectorLayerCobertura, vectorLayerNew    

var layer_geoserver_tramos,  layer_geoserver_geomainid,  layer_geoserver_manzana,   layer_geoserver_cobertura,  layer_geoserver_cobertura_bar, layer_geoserver_new,  layer_geoserver_gw_status_desfasaje,   layer_geoserver_gw_status_sin_info,  layer_geoserver_gw_status_posible, layer_geoserver_gw_status_ok, layer_geoserver_gw_status_revisar 


var   vectorSource, vectorSource_geoserver_tramos_desfasaje, vectorSource_geoserver_tramos_sin_info,  vectorSource_geoserver_tramos_posible, vectorSource_geoserver_tramos_ok, vectorSource_geoserver_tramos_revisar,  vectorSource_geoserver_geomainid,  vectorSource_geoserver_manzana, vectorSource_geoserver_cobertura_bar, vectorSource_geoserver_cobertura,  vectorSource_geoserver_new

Navarra.layers.add  =function() { 
  //*******************Layers localhost**********************//
subdomain = Navarra.geocoding_ol.load_subdomain();
filter = "cql_filter=(company='"+ Navarra.geo_editions.config.company+"')";

  if (subdomain == "supercanal.geoworks.gisworking.com" || subdomain == "lvh.me"){

   Navarra.layers.vectorSources();
    styleLayers();
   Navarra.layers.vectorLayers();
    console.log(vectorLayerOk);
    return [
      vectorLayerCoberturaBar, vectorLayerCobertura,  vectorLayerManzana,  vectorLayerNew,  vectorLayerDesfasaje, vectorLayerSinInfo, vectorLayerPosible, vectorLayerOk, vectorLayerRevisar  ];
//    return [vectorLayerOk,  vectorLayerDesfasaje ];
  }
}



Navarra.layers.urls = function(){
// if (subdomain == "lvh.me"){

     url = 'http://localhost:8080/geoserver/wms'

    layer_geoserver_tramos =  'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson' ;
    //var layer_geoserver_geomainid = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:geomanid&maxFeatures=50&outputFormat=application%2Fjson'
    layer_geoserver_geomainid = 'geoworks_lvh:geomanid';
     layer_geoserver_manzana = 'geoworks_lvh:manzanas';
     layer_geoserver_cobertura = 'geoworks_lvh:cobertura';
     layer_geoserver_cobertura_bar = 'geoworks_lvh:cobertura';
     layer_geoserver_new = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_new_geo_editions&maxFeatures=10050&outputFormat=application%2Fjson&styles=';
    //    var layer_geoserver_gw_status_desfasaje = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_desfasaje&maxFeatures=50&outputFormat=application%2Fjson'
    layer_geoserver_gw_status_desfasaje = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_desfasaje&maxFeatures=10050&outputFormat=application%2Fjson&'+ filter;
    layer_geoserver_gw_status_sin_info = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_sin_info&maxFeatures=10050&outputFormat=application%2Fjson&'+ filter;
    layer_geoserver_gw_status_posible = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_posible_barrio&maxFeatures=10050&outputFormat=application%2Fjson';
    layer_geoserver_gw_status_ok = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_ok&maxFeatures=10050&outputFormat=application%2Fjson&' + filter;
    layer_geoserver_gw_status_revisar = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_revisar&maxFeatures=10050&outputFormat=application%2Fjson&'+filter;

 // }
/*
  if (subdomain == "supercanal.geoworks.gisworking.com"){
    //*******************Layers Geoworks**********************/
    //    var layer_geoserver_tramos = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson';
    //    var layer_geoserver_geomainid = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:geomanid&maxFeatures=50&outputFormat=application%2Fjson'
/*
   var layer_geoserver_manzana = 'geoworks_supercanal:manzanas';
    var layer_geoserver_geomainid = 'geoworks_supercanal:geomanid';
    var layer_geoserver_cobertura_bar = 'geoworks_supercanal:cobertura_bar';
    var layer_geoserver_cobertura = 'geoworks_supercanal:cobertura';

    var layer_geoserver_new = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:view_new_geo_editions&maxFeatures=30000&outputFormat=application%2Fjson'
    var url = 'http://geoworks.gisworking.com:8080/geoserver/wms'
    var layer_geoserver_gw_status_sin_info = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_sin_info&maxFeatures=30000&outputFormat=application%2Fjson'

     layer_geoserver_gw_status_desfasaje = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_desfasaje&maxFeatures=30050&outputFormat=application%2Fjson'

    var layer_geoserver_gw_status_posible = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_posible_barrio&maxFeatures=30050&outputFormat=application%2Fjson' 
    var layer_geoserver_gw_status_ok = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_ok&maxFeatures=30050&outputFormat=application%2Fjson'
    var layer_geoserver_gw_status_revisar = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_revisar&maxFeatures=30050&outputFormat=application%2Fjson'
     url = 'http://geoworks.gisworking.com:8080/geoserver/wms'
  }
*/

}

  Navarra.layers.vectorSources= function() {
Navarra.layers.urls();
  vectorSource = new ol.source.Vector();
  /*    var vectorSource_geoserver_tramos = new ol.source.Vector({
      url: layer_geoserver_tramos,
      format: new ol.format.GeoJSON()
    });*/

   vectorSource_geoserver_tramos_desfasaje = new ol.source.Vector({
    url: layer_geoserver_gw_status_desfasaje,
    format: new ol.format.GeoJSON()
  });

  vectorSource_geoserver_tramos_sin_info = new ol.source.Vector({
    url: layer_geoserver_gw_status_sin_info,
    format: new ol.format.GeoJSON()
  });

  vectorSource_geoserver_tramos_posible = new ol.source.Vector({
    url: layer_geoserver_gw_status_posible,
    format: new ol.format.GeoJSON()
  });

   vectorSource_geoserver_tramos_ok = new ol.source.Vector({
    url: layer_geoserver_gw_status_ok,
    format: new ol.format.GeoJSON()
  });

  vectorSource_geoserver_tramos_revisar = new ol.source.Vector({
    url: layer_geoserver_gw_status_revisar,
    format: new ol.format.GeoJSON()
  });
  vectorSource_geoserver_geomainid = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_geomainid, VERSION: '1.1.0', cql_filter: Navarra.geo_editions.config.company} 
  });

  vectorSource_geoserver_manzana = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_manzana, VERSION: '1.1.0', cql_filter: Navarra.geo_editions.config.company} 
  });

  
  vectorSource_geoserver_cobertura_bar = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_cobertura_bar, VERSION: '1.1.0', cql_filter: Navarra.geo_editions.config.company} 
  });

  vectorSource_geoserver_cobertura = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_cobertura, VERSION: '1.1.0', cql_filter: Navarra.geo_editions.config.company} 
  });

  vectorSource_geoserver_new = new ol.source.Vector({
    url: layer_geoserver_new,
    format: new ol.format.GeoJSON()

  });
  
}

var styleSinInfo,  styleNew,  styleOk, styleRevisar, stylePosibleBarrio, styleDesfasaje,   
    styleLayers = function(){
      /********Styles********/
      styleSinInfo = function(feature) {
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

      styleNew = function(feature) {
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

      styleOk = function(feature) {
        geometry = feature.getGeometry();
        style_ok = [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#424242',
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

      styleRevisar = function(feature) {
        geometry = feature.getGeometry();
        style_revisar = [
          new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: '#FFA500',
              width: 2
            }) 
          })
        ]
        geometry.forEachSegment(function(start, end) {
          dx = end[0] - start[0];
          dy = end[1] - start[1];
          rotation = Math.atan2(dy, dx);
          //  arrows
          style_revisar.push(new ol.style.Style({
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
        return style_revisar;
      };
      stylePosibleBarrio = function(feature) {
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

      styleDesfasaje = function(feature) {
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


    }

var  vectorLayerSinInfo,  vectorLayerRevisar,  vectorLayerPosible,  vectorLayerOk,   vectorLayerDesfasaje, vectorLayerManzana, vectorLayerCoberturaBar, vectorLayerCobertura, vectorLayerNew    
 


    Navarra.layers.vectorLayers = function(){

      /*
    var vectorLayer = new ol.layer.Vector({
      title:'Supercanal - Rojo',
      type: 'overlays',
      source: vectorSource_geoserver_tramos,
      style: style_segment,
      visible: 'false'
    });*/

      /*  var vectorLayerGeomainid = new ol.layer.Tile({
    title:'GeomainID',
    type: 'overlays',
    source: vectorSource_geoserver_geomainid
  });
  */
      vectorLayerSinInfo = new ol.layer.Vector({
        title:'Gw status_Sin_Info',
        type: 'overlays',
        source:vectorSource_geoserver_tramos_sin_info,
        style: styleSinInfo
      });

       vectorLayerRevisar = new ol.layer.Vector({
        title:'Gw status Revisar',
        type: 'overlays',
        source:vectorSource_geoserver_tramos_revisar,
        style: styleRevisar
      });

    vectorLayerPosible = new ol.layer.Vector({
        title:'Gw status_Posible_Barrio',
        type: 'overlays',
        source:vectorSource_geoserver_tramos_posible,
        style: stylePosibleBarrio
      });

     vectorLayerOk = new ol.layer.Vector({
        title:'Gw status_Ok',
        type: 'overlays',
        source: vectorSource_geoserver_tramos_ok,
        style: styleOk
      });

      vectorLayerDesfasaje = new ol.layer.Vector({
        title:'Gw status_desfasaje',
        type: 'overlays',
        source: vectorSource_geoserver_tramos_desfasaje,
        style: styleDesfasaje
      });

      vectorLayerManzana = new ol.layer.Tile({
        title:'Centroi Manzana',
        type: 'overlays',
        source: vectorSource_geoserver_manzana
      });


      vectorLayerCoberturaBar = new ol.layer.Tile({
        title:'Cobertura 2',
        type: 'overlays',
        opacity: 0.4,
        source: vectorSource_geoserver_cobertura_bar
      });


      vectorLayerCobertura = new ol.layer.Tile({
        title:'Cobertura',
        type: 'overlays',
        opacity: 0.4,
        visible: 'false',
        source: vectorSource_geoserver_cobertura
      });

      vectorLayerNew = new ol.layer.Vector({
        title:'Segmentos nuevos',
        type: 'overlays',
        source: vectorSource_geoserver_new
      });

      //vectorLayerCoberturaBar.setVisible(false);
      vectorLayerSinInfo.setVisible(false);
      vectorLayerPosible.setVisible(false);
      //vectorLayerOk.setVisible(false); 
      vectorLayerDesfasaje.setVisible(false);
      //vectorLayerManzana.setVisible(false); 
      //vectorLayerCobertura.setVisible(false);
      //vectorLayerNew.setVisible(false); 

    }




