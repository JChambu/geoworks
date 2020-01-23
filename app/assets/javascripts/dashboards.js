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
  "minx": -180,
  "miny": -90,
  "maxx": 180,
  "maxy": 90,
  "current_tenant": '',
  "graph_id":'',
  size_box: [],
  name_layer: '',
  type_geometry: ''
};

Navarra.dashboards.action_show = function(){

  var init = function(){

    $(".chart-modal").on('click', function(){
     var   graph_id =  $(this).attr('id');
     Navarra.dashboards.config.graph_id= graph_id;
    });

    // Desactiva Puntos Coloreados
    $("#filter-body").on("click", "#close_colored_points", function() {

      $(".fa-spinner").css("color", "#9b9b9b");
      Navarra.project_types.config.field_point_colors = '';
      $('#colored_points').remove();
      Navarra.geomaps.wms_filter();
      Navarra.geomaps.point_colors_data();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }
      //Navarra.geomaps.current_layer();
      Navarra.geomaps.layers_external();
      Navarra.geomaps.layers_internal();

    });

    // Desactiva Mapa de Calor
    $("#filter-body").on("click", '#close_heatmap_filter', function() {

      $(".fa-fire").css("color", "#9b9b9b");
      Navarra.project_types.config.field_point_colors = '';
      Navarra.project_types.config.heatmap_field = '';
      $('#heatmap_filter').remove();
      Navarra.geomaps.remove_heatmap();

    });

    $("#filter-body").on("click", ".message",  function(){
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

    $("#view").on("click", function() {

      // Chequeamos el estado de view
      status_view = $('#view').hasClass('active');

      if (!status_view) { // Default
        $('#view').addClass('active');
        $(".fa-table").css("color", "#d3d800");
        $(".graphics").css("width", "50%");
        init_chart_doughnut();
      } else { // Expanded
        $('#view').removeClass('active');
        $(".fa-table").css("color", "#9b9b9b");
        $(".graphics").css("width", "30%");
        init_chart_doughnut();
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
