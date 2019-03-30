$(document).ready(function () {
    $.fakeLoader({
        bgColor: 'rgba(0, 0, 0, 0.5)',
        spinner:"spinner2",
    });
});

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

      $(".fa-spinner").css("color", "#9b9b9b");
      var da =  $(this).attr('id');
        Navarra.project_types.config.field_point_colors = '';
        $(this).remove();
      Navarra.geomaps.wms_filter();
      Navarra.geomaps.point_colors_data();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }
    });

    $(".add_heatmap").on("click", ".mes",  function(){

      $(".fa-fire").css("color", "#9b9b9b");
      var da =  $(this).attr('id');
        Navarra.project_types.config.field_point_colors = '';
        Navarra.project_types.config.heatmap_field = '';
        $(this).remove();
      Navarra.geomaps.remove_heatmap();

    });

    $(".add_filters").on("click", ".message",  function(){

      $(".fa-filter").css("color", "#9b9b9b");
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
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != ''){
        Navarra.geomaps.heatmap_data();
      }
      //init_chart_doughnut();
    });

    $("#hide_side").on("click", function(){

          $(".side_left").slideToggle("slow");
      })
    var  project_id = $("#data_id").val();

    $( "#view" ).on( "click", function() {

      //Chequeamos el estado de view
      status_view = $('#view').hasClass('active');

      if (!status_view){ //Active

        $(".fa-table").css("color", "#d3d800");

        $('#view').addClass('active');

        $("#active-filters").removeClass('col-md-3').addClass('col-md-6');
        $("#map").css("width", "50%");
        $(".right-column").css("width", "50%");

        init_chart_doughnut();

      }else{ //Default

        $(".fa-table").css("color", "#9b9b9b");

        $("#active-filters").removeClass('col-md-6').addClass('col-md-3');
        $("#map").css("width", "75%");
        $(".right-column").css("width", "25%");

        $('div.graphics').replaceWith( $('div.graphics'), init_chart_doughnut());
        status_view = $('#view').removeClass('active');

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
