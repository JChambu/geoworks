Navarra.namespace("geomaps");


Navarra.geomaps = function (){
  //var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;

  var init= function() {
  
  var map = L.map('mapid').setView([51.505, -0.09], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
        .openPopup();
  }
    
    return {
      init: init
      //    enableMap: enableMap,
      //    latitude_ol: latitude_ol,
      //    longitude_ol: longitude_ol,
      //    line_ol: line_ol

    }
  }();
