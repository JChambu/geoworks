Navarra.namespace("layers.add");
Navarra.namespace("layers.basemaps");
Navarra.namespace("layers.api");
Navarra.namespace("layers.urls");
Navarra.namespace("layers.vectorSources");
Navarra.namespace("layers.vectorLayers");
Navarra.namespace("layers.labels");



Navarra.layers.basemaps = function(){

  var osmLayer = new ol.layer.Tile({
    title: 'OSM',
    type: 'base',
    visible: 'true',
    opacity: 0.9,
    source: new ol.source.OSM({
     "url": "http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      crossOrigin: '*'
    } )
  });
  var noneLayer = new ol.layer.Tile({
    title: 'Sin Mapa',
    type: 'base'
  });


  osmLayer.on('postcompose', function(event) {
   greyscale(event.context);
})

  //function applies greyscale to every pixel in canvas
  function greyscale(context) {
    var canvas = context.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var imageData = context.getImageData(0, 0, width, height);
    var data = imageData.data;
    for(i=0; i<data.length; i += 4){
      var r = data[i];
      var g = data[i + 1];
      var b = data[i + 2];
      // CIE luminance for the RGB
      var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // Show white color instead of black color while loading new tiles:
      if(v === 0.0)
        v=255.0;  
      data[i+0] = v; // Red
      data[i+1] = v; // Green
      data[i+2] = v; // Blue
      data[i+3] = 255; // Alpha
    }
    context.putImageData(imageData,0,0);
  }
  return [noneLayer, osmLayer];
}

/*Navarra.layers.api = function(){
let data_f = []
    $.ajax({
        type: 'GET',
        url: '/project_types/maps.json',
        datatype: 'json',
        data: {data_id: '10e64be4-f9c5-4f32-8505-523628c52d46'},
      success: function(data){
        data_f = data;
    },
      error: function(XHR, textStatus, error){
        console.log(error);
      }
    })

  return data_f;
/*
  var markers = new ol.layer.Tile({
    title: 'OSM',
    type: 'layer',
    visible: 'true',
    opacity: 0.9,
    source: new ol.source.OSM()
  });

  return [markers];

}*/



var filter, subdomain 
var  vectorLayerSinInfo,  vectorLayerRevisar,  vectorLayerPosible,  vectorLayerOk,   vectorLayerDesfasaje, vectorLayerManzana, vectorLayerCoberturaBar, vectorLayerCobertura, vectorLayerNew 

var layer_geoserver_tramos,  layer_geoserver_geomainid,  layer_geoserver_manzana,   layer_geoserver_cobertura,  layer_geoserver_cobertura_bar, layer_geoserver_new,  layer_geoserver_gw_status_desfasaje,   layer_geoserver_gw_status_sin_info,  layer_geoserver_gw_status_posible, layer_geoserver_gw_status_ok, layer_geoserver_gw_status_revisar 

var   vectorSource, vectorSource_geoserver_tramos_desfasaje, vectorSource_geoserver_tramos_sin_info,  vectorSource_geoserver_tramos_posible, vectorSource_geoserver_tramos_ok, vectorSource_geoserver_tramos_revisar,  vectorSource_geoserver_geomainid,  vectorSource_geoserver_manzana, vectorSource_geoserver_cobertura_bar, vectorSource_geoserver_cobertura,  vectorSource_geoserver_new

var styleSinInfo,  styleNew,  styleOk, styleRevisar, stylePosibleBarrio, styleDesfasaje   


Navarra.layers.surba = function(){

    url = 'http://localhost:8080/geoserver/wms';
    layers_geoserver_label = 'geoworks:view_luminarias'

  vectorSource_layer_label = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layers_geoserver_label, VERSION: '1.1.0'} 
  });
  
  var label = new ol.layer.Tile({
    title: 'Etiqueta',
    opacity: 0.9,
    source: vectorSource_layer_label 
  });
  
  sourcePoint = 'http://localhost:8080/geoserver/geoworks/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks:view_luminarias&maxFeatures=50000&outputFormat=application%2Fjson'

  vectorSourcePoint = new ol.source.Vector({
    url:  sourcePoint,
    format: new ol.format.GeoJSON()
  });

  vectorLayerPoint = new ol.layer.Vector({
    title:'Gw status Revisar',
    type: 'overlays',
    source: vectorSourcePoint,
  });

  vectorLayerPoint.setVisible(true);

    var label = new ol.layer.Tile({
      title: 'eti',
      type: 'overlays',
      visible: 'true',
      source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/wms',
        PARAMS: {LAYERS: layers_geoserver_label , VERSION: '1.1.0'} 
      })
    });

  return [vectorLayerPoint];
console.log("hola_layers");
}




Navarra.layers.labels = function(){

  subdomain = Navarra.geocoding_ol.load_subdomain();
var url, layers_geoserver_label ;
  if (subdomain == "lvh.me"){
    url = 'http://localhost:8080/geoserver/wms';
    layers_geoserver_label = 'geoworks_lvh:label_number_door'
  }

  if (subdomain == "supercanal.geoworks.gisworking.com"){

    url = 'http://geoworks.gisworking.com:8080/geoserver/wms'

    layers_geoserver_label = 'geoworks_supercanal:label_number_door'
  }

  vectorSource_layer_label = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layers_geoserver_label, VERSION: '1.1.0'} 
  });

  var label = new ol.layer.Tile({
    title: 'Etiqueta',
    opacity: 0.9,
    source: vectorSource_layer_label 

  });

  label.setVisible(false);

  
  
  
  
  return [label];
}

Navarra.layers.add  =function() { 
  //*******************Layers localhost**********************//
  subdomain = Navarra.geocoding_ol.load_subdomain();

  filter = "cql_filter=(company='"+ Navarra.geo_editions.config.company+"')";
  if (subdomain == "supercanal.geoworks.gisworking.com" || subdomain == "lvh.me"){

    Navarra.layers.vectorSources();
    styleLayers();
    Navarra.layers.vectorLayers();

    var label = new ol.layer.Tile({
      title: 'eti',
      type: 'overlays',
      visible: 'true',
      source: new ol.source.TileWMS({
        url:'http://localhost:8080/geoserver/wms',
        PARAMS: {LAYERS: 'geoworks_lvh:label_number_door', VERSION: '1.1.0'} 
      })
    });




    return [
      vectorLayerCoberturaBar, vectorLayerCobertura,  vectorLayerManzana,  vectorLayerNew,  vectorLayerDesfasaje, vectorLayerSinInfo, vectorLayerPosible, vectorLayerOk, vectorLayerRevisar, label  ];
    //    return [vectorLayerOk,  vectorLayerDesfasaje ];
  }
}

Navarra.layers.urls = function(){
  if (subdomain == "lvh.me"){

    url = 'http://localhost:8080/geoserver/wms'

    layer_geoserver_tramos =  'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_geo_editions&maxFeatures=10000&outputFormat=application%2Fjson' ;
    layer_geoserver_geomainid = 'geoworks_lvh:geomanid';
    layer_geoserver_manzana = 'geoworks_lvh:manzanas';
    layer_geoserver_cobertura = 'geoworks_lvh:cobertura';
    layer_geoserver_cobertura_bar = 'geoworks_lvh:cobertura';
    layer_geoserver_new = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:view_new_geo_editions&maxFeatures=10050&outputFormat=application%2Fjson&styles=';
    layer_geoserver_gw_status_desfasaje = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_desfasaje&maxFeatures=10050&outputFormat=application%2Fjson&'+ filter;
    layer_geoserver_gw_status_sin_info = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_sin_info&maxFeatures=10050&outputFormat=application%2Fjson&'+ filter;
    layer_geoserver_gw_status_posible = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_posible_barrio&maxFeatures=10050&outputFormat=application%2Fjson&' + filter;
    layer_geoserver_gw_status_ok = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_ok&maxFeatures=10050&outputFormat=application%2Fjson&' + filter;
    layer_geoserver_gw_status_revisar = 'http://localhost:8080/geoserver/geoworks_lvh/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_lvh:gw_status_revisar&maxFeatures=10050&outputFormat=application%2Fjson&'+filter;

  }

  if (subdomain == "supercanal.geoworks.gisworking.com"){
    //*******************Layers Geoworks**********************/
    layer_geoserver_manzana = 'geoworks_supercanal:manzanas';
    layer_geoserver_geomainid = 'geoworks_supercanal:geomanid';
    layer_geoserver_cobertura_bar = 'geoworks_supercanal:cobertura_bar';
    layer_geoserver_cobertura = 'geoworks_supercanal:cobertura';
    layer_geoserver_new = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:view_new_geo_editions&maxFeatures=30000&outputFormat=application%2Fjson&' + filter ;
    layer_geoserver_gw_status_sin_info = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_sin_info&maxFeatures=30000&outputFormat=application%2Fjson&' + filter ;

    layer_geoserver_gw_status_desfasaje = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_desfasaje&maxFeatures=30050&outputFormat=application%2Fjson&' + filter ;

    layer_geoserver_gw_status_posible = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_posible_barrio&maxFeatures=30050&outputFormat=application%2Fjson&' + filter;
    layer_geoserver_gw_status_ok = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_ok&maxFeatures=30050&outputFormat=application%2Fjson&' + filter;
    layer_geoserver_gw_status_revisar = 'http://geoworks.gisworking.com:8080/geoserver/geoworks_supercanal/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=geoworks_supercanal:gw_status_revisar&maxFeatures=30050&outputFormat=application%2Fjson&' + filter ;
    url = 'http://geoworks.gisworking.com:8080/geoserver/wms'
  }

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
    params: { LAYERS: layer_geoserver_geomainid, VERSION: '1.1.0'} 
  });

  vectorSource_geoserver_manzana = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_manzana, VERSION: '1.1.0'} 
  });


  vectorSource_geoserver_cobertura_bar = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_cobertura_bar, VERSION: '1.1.0'} 
  });

  vectorSource_geoserver_cobertura = new ol.source.TileWMS({
    url: url,
    params: { LAYERS: layer_geoserver_cobertura, VERSION: '1.1.0' } 
  });

  vectorSource_geoserver_new = new ol.source.Vector({
    url: layer_geoserver_new,
    format: new ol.format.GeoJSON()

  });

}


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

      /*      style_sin_info.push(new ol.style.Style({
          text: new ol.style.Text({
          font: '14px Verdana',
          text: getText(feature),
          fill: new ol.style.Fill({color: 'black'}),
          textBaseline: 'bottom',
            rotation: -rotation
        })
        })),*/
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
          //color: '#298A08',
          color: 'brown',
          width: 2
        }) 
      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);


      if (rotation < 0){
        rotation_text = Math.atan2(-dy,dx);
      }else{
        rotation_text = Math.atan2(-dy, -dx);
      }
      /*      style_new.push(new ol.style.Style({
          text: new ol.style.Text({
          font: '14px Verdana',
          text: getText(feature),
          fill: new ol.style.Fill({color: 'black'}),
          textBaseline: 'bottom'
        })
        })),*/
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


  var getText = function(feature){

    if (feature.get('gw_pta_ini') != null && feature.get('gw_pta_fin') != null) {
      var      text = feature.get('gw_pta_ini') + " - " + feature.get('gw_pta_fin');
      //  }else{

      //      text = feature.get('number_door_start_original') + " - " + feature.get('number_door_end_original');

    }
    return text;


  }


  styleOk = function(feature) {
    var rotation;
    geometry = feature.getGeometry();
    style_ok = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'black',
          width: 2
        }),

      })
    ]
    geometry.forEachSegment(function(start, end) {
      dx = end[0] - start[0];
      dy = end[1] - start[1];
      rotation = Math.atan2(dy, dx);
      //  arrows

      /*        style_ok.push(new ol.style.Style({
          text: new ol.style.Text({
          font: '14px Verdana',
          text: getText(feature),
          fill: new ol.style.Fill({color: 'black'}),
          textBaseline: 'bottom',
            rotation: -rotation
        })
        })),
        */
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


      /*
      style_revisar.push(new ol.style.Style({
          text: new ol.style.Text({
          font: '14px Verdana',
          text: getText(feature),
          fill: new ol.style.Fill({color: 'black'}),
          textBaseline: 'bottom',
            rotation: rotation_text
        })
        })),*/
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

      /*      style_posible.push(new ol.style.Style({
          text: new ol.style.Text({
          font: '14px Verdana',
          text: getText(feature),
          fill: new ol.style.Fill({color: 'black'}),
          textBaseline: 'bottom',
            rotation: -rotation
        })
        })),*/
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

      style_desfasaje.push(new ol.style.Style({
        text: new ol.style.Text({
          font: '14px Verdana',
          text: getText(feature),
          fill: new ol.style.Fill({color: 'black'}),
          textBaseline: 'bottom',
          rotation: -rotation
        })
      })),
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

//var  vectorLayerSinInfo,  vectorLayerRevisar,  vectorLayerPosible,  vectorLayerOk,   vectorLayerDesfasaje, vectorLayerManzana, vectorLayerCoberturaBar, vectorLayerCobertura, vectorLayerNew    



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
    name: 'nuevo',
    source: vectorSource_geoserver_new,
    style: styleNew
  });



  //vectorLayerCoberturaBar.setVisible(false);
  //vectorLayerSinInfo.setVisible(false);
  //vectorLayerPosible.setVisible(false);
  //vectorLayerOk.setVisible(false); 
  //vectorLayerDesfasaje.setVisible(false);
  //vectorLayerManzana.setVisible(false); 
  //vectorLayerCobertura.setVisible(false);
  //vectorLayerNew.setVisible(false); 

[vectorLayerCoberturaBar, vectorLayerCobertura,  vectorLayerManzana,  vectorLayerNew,  vectorLayerDesfasaje, vectorLayerSinInfo, vectorLayerPosible, vectorLayerOk, vectorLayerRevisar].forEach(function(layer){
    layer.on('change:visible', function(e){
      console.log(layer);
  console.log('Mi capa ${layer.name} está visible ? ${layer.getVisible()}')  
    }) 
  })
}




