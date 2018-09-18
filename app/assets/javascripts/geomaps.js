Navarra.namespace("geomaps");

Navarra.geomaps = function (){
  //var map,  featureOverlay, selectCtrl, mainbar, editbar, vector, iconStyle, popup, container, content, highlight;
  var mymap;
  var init= function() {

    var xView =-32.933;
    var yView= -71.543;

    var mymap = L.map('mapid',{
      zoomControl: false
    }).setView([xView, yView], 15);

    var Layerppal=L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: '',
      maxZoom: 18,
      id: 'mapbox.light',
      accessToken: 'pk.eyJ1IjoiZmxhdmlhYXJpYXMiLCJhIjoiY2ppY2NzMm55MTN6OTNsczZrcGFkNHpoOSJ9.cL-mifEoJa6szBQUGnLmrA'
    }).addTo(mymap);

    L.control.zoom({
      position:'topright'
    }).addTo(mymap);

    var markers;
    if (markers !=undefined){
      mymap.removeLayer(markers);
    }

/*    for (i = 0;  i < Navarra.dashboards.config.lon.length; i++) {
      lon = parseFloat(Navarra.dashboards.config.lon[i]);
      lat = parseFloat(Navarra.dashboards.config.lat[i]);

      //  console.log(lon);

      marker = L.marker([lat, lon]).addTo(mymap) 
    }*/
   

    markers = L.markerClusterGroup({
      // disableClusteringAtZoom: true
      maxClusterRadius: 30
    });
    var geoJsonLayer = new L.geoJSON();
    var owsrootUrl = 'http://localhost:8080/geoserver/ows';
    var defaultParameters = {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      //  typeName: 'geoworks:view_luminarias',
      typeName: 'geoworks:view_project_geoserver',
      maxFeatures: 1000,
      outputFormat: 'application/json',
    };
//    console.log(Navarra.dashboards.config.project_type_id);  

        defaultParameters.CQL_FILTER = "project_type_id="+Navarra.dashboards.config.project_type_id  ;
    /* if (FiltrosAcumulados.length > 0 ){
        defaultParameters.CQL_FILTER = "1=1";
        $.each(FiltrosAcumulados, function(a,b){
          var condition_cql = b[0].toLowerCase();
          defaultParameters.CQL_FILTER += " and "+condition_cql+"='"+b[1]+"'";
        });
      }*/
      var parameters = L.Util.extend(defaultParameters);
    var URL = owsrootUrl + L.Util.getParamString(parameters);
    //Custom radius and icon create function
    $.ajax({
      url: URL,
      dataType: 'json',
      jsonpCallback: 'parseResponse',
      success: function (data) {
        geoJsonLayer.addData(data);         
        markers.addLayer(geoJsonLayer);
        bounds = markers.getBounds();   
        mymap.fitBounds(bounds);     
        mymap.addLayer(markers);
      }
    });
 
     size_box = mymap.getBounds();

          Navarra.dashboards.config.size_box = size_box;  
          init_chart_doughnut();  
    /*
    L.marker([51.5, -0.09]).addTo(mymap)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
      */


    $('#select').on('click', function(event) {
      checked = $('#select').hasClass('active');
      if (checked){
        $('#select').removeClass('active');

      }else{
        $('#select').addClass('active');


        // Initialise the draw control and pass it the FeatureGroup of editable layers

        HandlerPolygon = new L.Draw.Polygon(mymap);
        HandlerPolygon.enable();

        var OpcionesPoligono={
          shapeOptions: {
            color: '#F0D33F',
          },
        }
        var editableLayers = new L.FeatureGroup();
        mymap.addLayer(editableLayers);

        mymap.on('draw:created', function(e) {
          console.log(e);

        });

      }  
    });
  }


  return {
    init: init
    //    enableMap: enableMap,
    //    latitude_ol: latitude_ol,
    //    longitude_ol: longitude_ol,
    //    line_ol: line_ol
  }
}();
