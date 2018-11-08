Navarra.namespace("dashboards.action_show");

Navarra.dashboards.config = {
  "lon": [],
  "lat": [],
  "project_type_id": null,
  "dashboard_id": null,
  size_box: []
};

Navarra.dashboards.action_show = function(){

  var init = function(){
    var  project_id = $("#data_id").val();
    Navarra.geomaps.init();

    $( "#view" ).on( "click", function() {
      status_view = $('#view').hasClass('active');
      if (!status_view){
        $('#view').addClass('active');
        var o = parseInt(window.innerHeight) - 100;
        //var w = parseInt(window.innerWidth) - 600;
        //var h = parseInt(window.innerWidth) - 600;

        $("#map").css("height", o+"px"); //map.invalidateSize();
        $("#map").css("width", "75%"); //map.invalidateSize();
        $("#map").css("float", "left"); //map.invalidateSize();

        $(".graphics div").removeClass("col-md-3");
        $(".graphics div").removeClass("col-md-6");
        $(".graphics div").removeClass("col-md-9");
        $(".graphics div").removeClass("col-md-12");

        $(".gridactive").css("width", "auto"); //map.invalidateSize();
        $(".graphics").css("height", o+"px"); //map.invalidateSize();
        $(".graphics").css("width", "25%"); //map.invalidateSize();
        $(".graphics").css("float", "right"); //map.invalidateSize();
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
        $("#map").css("float", "none");
        $(".gridactive").css("width", "50%");
        $(".graphics").css("height", o+"px"); //map.invalidateSize();
        $(".graphics").css("width", "100%"); //map.invalidateSize();
        $(".graphics").removeClass( "col-md-3");
        $(".graphics").toggleClass( "col-md-12", 500, "easeOutSine" );
        $("#clas_map").toggleClass( "col-md-12", 500, "easeOutSine" );
        $(".card_graph").removeClass( "col-md-12");
        $(".card_graph").toggleClass( "col-md-6", 500, "easeOutSine" );
      }
    });

    $(".graphics").on('click','canvas',function(){
          value_graph = $(this).attr("id");
          canvas_edit = this;
          project_type_id = Navarra.dashboards.config.project_type_id;
          dashboard_id = Navarra.dashboards.config.dashboard_id;
          graphic_id = value_graph.split('canvas');
          $.getScript("/project_types/"+ project_type_id+"/dashboards/"+dashboard_id+"/graphics/"+graphic_id[1]+"/edit");
          console.log(graphic_id);
        });
  }

  return {
    init: init,
  }
}();
