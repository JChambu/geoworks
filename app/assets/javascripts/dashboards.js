Navarra.namespace("dashboards.action_show");


Navarra.dashboards.config = {
  "lon": [],
  "lat": [],
  "project_type_id": null,
  size_box: []
};


Navarra.dashboards.action_show = function(){

  var init = function(){
    var  project_id = $("#data_id").val();
    Navarra.geomaps.init();

$( "#view" ).on( "click", function() {
        //$( "#clas_map" ).removeClass( "col-md-12" ).addClass( "col-md-5" );
        $("#clas_map").toggleClass( "col-md-9", 500, "easeOutSine" );
        $("#mapid").toggleClass( "mapid_full", 500, "easeOutSine" );
        $(".graphics").toggleClass( "col-md-3", 500, "easeOutSine" );
      });

  }
  return {
    init: init,
  }
}();

