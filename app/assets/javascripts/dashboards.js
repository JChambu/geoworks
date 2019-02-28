Navarra.namespace("dashboards.action_show");

Navarra.dashboards.config = {
  "lon": [],
  "lat": [],
  "project_type_id": null,
  "dashboard_id": null,
  "minx": null,
  "miny": null,
  "maxx": null,
  "maxy": null,
  "current_tenant": '',
  "graph_id":'',
  size_box: [],
  name_layer: ''
};

Navarra.dashboards.action_show = function(){

  var init = function(){

    $(".chart-modal").on('click', function(){
     var   graph_id =  $(this).attr('id');
     Navarra.dashboards.config.graph_id= graph_id;
    });

    $(".add_field_point_color").on("click", ".mes",  function(){
      var da =  $(this).attr('id');
        Navarra.project_types.config.field_point_colors = '';
        $(this).remove();
      Navarra.geomaps.wms_filter();
      Navarra.geomaps.point_colors_data();

    });

      $(".add_filters").on("click", ".message",  function(){
      var da =  $(this).attr('id');

        Navarra.project_types.config.field_point_colors = '';
        $(this).remove();

      var kpi_value =  $(this).attr('value');
      ar = Navarra.project_types.config.filter_option;
      option_kpi = Navarra.project_types.config.filter_kpi;
      field_point = Navarra.project_types.config.field_point_colors;

      b = $.grep(ar, function(value){
          return value != da;
      })
      kpi = $.grep(option_kpi, function(value){
          return value != kpi_value;
      })

      Navarra.project_types.config.filter_option = b;
      Navarra.project_types.config.filter_kpi = kpi;
      $(this).remove();
      Navarra.geomaps.wms_filter();
      Navarra.geomaps.point_colors_data();
      //init_chart_doughnut();
    });

    $("#hide_side").on("click", function(){

          $(".side_left").slideToggle("slow");
      })
    var  project_id = $("#data_id").val();

    $( "#view" ).on( "click", function() {
      status_view = $('#view').hasClass('active');
      if (!status_view){
        $('#view').addClass('active');
        var o = parseInt(window.innerHeight) - 100;

        $("#map").css("height", o+"px");
        $("#map").css("width", "75%");
        $("#map").css("float", "left");
        $(".graphics div").removeClass("col-md-3");
        $(".graphics div").removeClass("col-md-6");
        $(".graphics div").removeClass("col-md-9");
        $(".graphics div").removeClass("col-md-12");
        $(".gridactive").css("width", "auto");
        $(".graphics").css("height", o+"px");
        $(".graphics").css("width", "25%");
        $(".graphics").css("float", "right");
        $("#clas_map").toggleClass( "col-md-9", 500, "easeOutSine" );
        $(".graphics").removeClass( "col-md-12");
        $(".graphics").toggleClass( "col-md-3", 500, "easeOutSine" );
        $(".card_graph").removeClass( "col-md-6");
        $(".card_graph").toggleClass( "col-md-12", 500, "easeOutSine" );

        init_chart_doughnut();
      }else{
        $(".graphics").removeClass("col-md-3");
        $(".graphics").removeClass("col-md-3");
        $(".graphics").css("width", "100%");
        $('div.graphics').replaceWith( $('div.graphics'), init_chart_doughnut());
        status_view = $('#view').removeClass('active');
        var o = 400;
        $("#map").css("height", o+"px"); //map.invalidateSize();
        $("#map").css("width", "100%"); //map.invalidateSize();
        $("#map").css("float", "none");

      }
    });

    $(".graphics").on('click','canvas',function(){
          value_graph = $(this).attr("id");
          canvas_edit = this;
          project_type_id = Navarra.dashboards.config.project_type_id;
          dashboard_id = Navarra.dashboards.config.dashboard_id;
          graphic_id = value_graph.split('canvas');
          $.getScript("/project_types/"+ project_type_id+"/dashboards/"+dashboard_id+"/graphics/"+graphic_id[1]+"/edit");
        });
    Navarra.geomaps.init();
  }
  return {
    init: init,
  }
}();
