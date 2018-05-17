Navarra.namespace("geomaps");


Navarra.geomaps = function (){
  //var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;

  var init= function() {
  
  var map = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer.grayscale('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

//    L.marker([51.5, -0.09]).addTo(map)
//        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//        .openPopup();

/*    var redatos = {};
    redatos['data_id'] =  352;
  
    $.ajax({
      type: 'GET',
      url: '/project_types/maps.json',
      datatype: 'json',
      data: redatos,
      success: function(data){
        var feature = [];
        $.each(data, function(i,val){
          var longitude = val['longitude'];
          var latitude = val ['latitude'];
          L.marker([latitude, longitude]).addTo(map)
        })
      }
      })*/

    var geojsonLayer = new L.geoJson.ajax("/project_types/maps.json");
    jsonLayer.addUrl(geojsonLayer);


  }
    
    return {
      init: init
      //    enableMap: enableMap,
      //    latitude_ol: latitude_ol,
      //    longitude_ol: longitude_ol,
      //    line_ol: line_ol

    }
  }();
