Navarra.namespace("dashboards.action_show");
Navarra.namespace("dashboards.action_create_graph");

Navarra.dashboards.config = {
  "lon": [],
  "lat": [],
  "project_type_id": null,
  size_box: []
};


Navarra.dashboards.action_create_graph = function(){

  data = {};
  labels={}
  options= { 
    fullWidth: true,
    chartPadding: {
      right: 40
    }
  };

  var init = function(){
    new Chartist.Line('.ct-chart', data, options)
    $("#cambiar").on('click', function(){
      data= {
        series: [
          [100, 110, 120, 130, 140],
          [160, 170, 180, 190, 200],
          [50, 60, 70, 80, 90]
        ],
        labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']
      };
      new Chartist.Line('.ct-chart', data, options)
    })
  }

  return {
    init: init,
  }
}();
Navarra.dashboards.action_show = function(){

  var init = function(){
    var  project_id = $("#data_id").val();
    Navarra.geomaps.init();

    $( "#view" ).on( "click", function() {
      status_view = $('#view').hasClass('active');
      if (!status_view){
        $('#view').addClass('active');
        var o = parseInt(window.innerHeight) - 100;
        var w = parseInt(window.innerWidth) - 600;
        
        var h = parseInt(window.innerWidth) - 600;
        $("#map").css("height", o+"px"); //map.invalidateSize();
        $("#map").css("width", "75%"); //map.invalidateSize();
        $(".graphics").css("height", o+"px"); //map.invalidateSize();
        $(".graphics").css("width", "25%"); //map.invalidateSize();
        $("#clas_map").toggleClass( "col-md-9", 500, "easeOutSine" );
        $(".graphics").removeClass( "col-md-12");
        $(".graphics").toggleClass( "col-md-3", 500, "easeOutSine" );
        $(".card_graph").removeClass( "col-md-6");
        $(".card_graph").toggleClass( "col-md-12", 500, "easeOutSine" );
      }else{
        status_view = $('#view').removeClass('active');
        var o = 400;
        $("#map").css("height", o+"px"); //map.invalidateSize();
        $("#map").css("width", "100%"); //map.invalidateSize();
        $(".graphics").css("height", o+"px"); //map.invalidateSize();
        $(".graphics").css("width", "100%"); //map.invalidateSize();
        $(".graphics").removeClass( "col-md-3");
        $(".graphics").toggleClass( "col-md-12", 500, "easeOutSine" );
        $("#clas_map").toggleClass( "col-md-12", 500, "easeOutSine" );
        $(".card_graph").removeClass( "col-md-12");
        $(".card_graph").toggleClass( "col-md-6", 500, "easeOutSine" );
    }
    });
  }
  return {
    init: init,
  }
}();

