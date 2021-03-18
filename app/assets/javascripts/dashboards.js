$(document).ready(function () {
    $.fakeLoader({
        bgColor: 'rgba(0, 0, 0, 0.5)',
        spinner:"spinner2",
    });
});

// Establece alto de mapa y sidebar al redimensionar
$(window).on('resize', function() {
  var height_browser = window.innerHeight
  var height_dashboard = height_browser - 60
  $("#map").css("height", height_dashboard);
  $(".sidebar").css("height", height_dashboard);
  var height_card=$(".card_data").innerHeight()
  var height_table = height_browser/2 - height_card -50
 // $(".table_scroll").css("height", height_table);
  resize_graphics()
});

// Establece alto de mapa y sidebar al cargar
$(document).ready(function() {
  var height_browser = window.innerHeight
  var height_dashboard = height_browser - 60
  $("#map").css("height", height_dashboard);
  $(".sidebar").css("height", height_dashboard);
  resize_graphics()
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
  draw_disabled: true,
  size_box: [],
  size_polygon: [],
  name_layer: '',
  name_project: '',
  type_geometry: '',
  current_tenement: '',
  user_name: ''
};

resize_graphics = function(){
  // Modificamos el alto de graphics según el alto de filter_container
  var sidebar_height = $(".sidebar").height()
  var filter_container_height = $("#filter-container").height()
  var height_graphics = sidebar_height - filter_container_height - 20
  $(".graphics").css("height", height_graphics);
}

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

      resize_graphics();
    });

    // Desactiva Mapa de Calor
    $("#filter-body").on("click", '#close_heatmap_filter', function() {

      $(".fa-fire").css("color", "#9b9b9b");
      Navarra.project_types.config.field_point_colors = '';
      Navarra.project_types.config.heatmap_field = '';
      $('#heatmap_filter').remove();
      Navarra.geomaps.remove_heatmap();

      resize_graphics();
    });

    // Desactiva filtro creado por el usuario
    $("#filter-body").on("click", ".message", function() {

      var current_filters;
      var filter_to_remove;

      if ($(this).hasClass("form_filter")) {
        current_filters = Navarra.project_types.config.attribute_filters;
        filter_to_remove = $(this).attr('id');
        updated_filters = $.grep(current_filters, function(value) {
          return value != filter_to_remove;
        })
        Navarra.project_types.config.attribute_filters = updated_filters;
      } else {
        current_filters = Navarra.project_types.config.filtered_form_ids;
        filter_to_remove = $(this).attr('value');
        updated_filters = $.grep(current_filters, function(value) {
          return value != filter_to_remove;
        })
        Navarra.project_types.config.filtered_form_ids = updated_filters;
      }

      $(".fa-filter").css("color", "#9b9b9b");
      $(this).remove();
      Navarra.geomaps.wms_filter();

      // TODO: Esto se debería revisar cuando se actualice la herramienta de colorear puntos
      // Navarra.project_types.config.field_point_colors = '';
      // Navarra.geomaps.point_colors_data();

      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }
      resize_graphics();
    });

    $("#hide_side").on("click", function(){

          $(".side_left").slideToggle("slow");
      })
    var  project_id = $("#data_id").val();

    //Ventana lateral

    //Expandir toda la pantalla
    $("#view-expanded").on("click", function() {
      var status_view_condensed = $('#status-view').hasClass('status-view-condensed');
        $('#status-view-sidebar').removeClass('status-view-condensed');
        $('#status-view-sidebar').removeClass('status-view-middle');
        $('#status-view-sidebar').addClass('status-view-expanded');
        $(".sidebar").css("transition-delay", "0.2s");
        $(".sidebar").css("width", "60%");
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("width", "40%");
        $(".leaflet-right").css("margin-right", "60%");
        
        if(status_view_condensed){
          $(".table_data_container").css("transition-delay", "0s");
          $("#filter-container").css("transition", "2s");
          $(".graphics").css("transition", "1s");
          $("#filter-container").css("transition-delay", "0.3s");
          $(".graphics").css("transition-delay", "0.3s");
          $("#filter-container").css("transform", "scale(1)");
          $(".graphics").css("transform", "scale(1)");
          init_chart_doughnut();          
        } else{
          draw_charts();
        }
    });
    //Minimizar la pantalla
    $("#view-hidden").on("click", function() {
      $('#status-view-sidebar').addClass('status-view-condensed');
      $('#status-view-sidebar').removeClass('status-view-middle');
      $('#status-view-sidebar').removeClass('status-view-expanded');
      $(".sidebar").css("transition-delay", "0.2s");
      $(".sidebar").css("width", "1.2%");
      $("#filter-container").css("transition", "0s");
      $(".graphics").css("transition", "0s");
      $("#filter-container").css("transition-delay", "0s");
      $(".graphics").css("transition-delay", "0s");
      $("#filter-container").css("transform", "scale(0)");
      $(".graphics").css("transform", "scale(0)");
      $(".leaflet-right").css("margin-right", "1%");
      $(".table_data_container").css("transition-delay", "0.2s");
      $(".table_data_container").css("width", "99%");
    });

    //Abrir a mitad de pantalla
    $("#view-middle").on("click", function() {
      var status_view_condensed = $('#status-view-sidebar').hasClass('status-view-condensed');
        $('#status-view-sidebar').removeClass('status-view-condensed');
        $('#status-view-sidebar').removeClass('status-view-expanded');
        $('#status-view-sidebar').addClass('status-view-middle');
        $(".sidebar").css("transition-delay", "0s");
        $(".sidebar").css("width", "30%");
        $(".leaflet-right").css("margin-right", "30%");
        $(".table_data_container").css("transition-delay", "0.2s");
        $(".table_data_container").css("width", "70%");
        draw_charts();
        if(status_view_condensed){
          $(".sidebar").css("transition-delay", "0.2s");
          $(".table_data_container").css("transition-delay", "0s");
          $(".table_data_container").css("width", "70%");
          $("#filter-container").css("transition", "2s");
          $(".graphics").css("transition", "1s");
          $("#filter-container").css("transition-delay", "0.3s");
          $(".graphics").css("transition-delay", "0.3s");
          $("#filter-container").css("transform", "scale(1)");
          $(".graphics").css("transform", "scale(1)");
          init_chart_doughnut();
        } else{
          draw_charts();
        }
    });


    $("#view").on("click", function() {
      // Chequeamos el estado de view
      status_view = $('#view').hasClass('view-normal');
      status_view_expanded = $('#view').hasClass('view-expanded');
      status_view_right = $('#view').hasClass('view-normal-right');
      status_view_condensed = $('#view').hasClass('view-condensed');
      if (status_view) { // Default
        $('#view').addClass('view-expanded');
        $('#view').removeClass('view-normal');
        $('#view').removeClass('fa-arrow-alt-circle-left');
        $('#view').addClass('fa-arrow-alt-circle-right');
        $(".sidebar").css("transition-delay", "0.2s");
        $(".sidebar").css("width", "60%");
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("width", "40%");
        $(".leaflet-right").css("margin-right", "60%");
        draw_charts();
      }
      if (status_view_expanded) { // Expanded
        $('#view').removeClass('view-expanded');
        $('#view').addClass('view-normal-right');
        $(".sidebar").css("transition-delay", "0s");
        $(".sidebar").css("width", "30%");
        $(".leaflet-right").css("margin-right", "30%");
        $(".table_data_container").css("transition-delay", "0.2s");
        $(".table_data_container").css("width", "70%");
        draw_charts();
      }
      if (status_view_right) { // Normal Right
        $('#view').removeClass('view-normal-right');
        $('#view').addClass('view-condensed');
        $('#view').removeClass('fa-arrow-alt-circle-right');
        $('#view').addClass('fa-arrow-alt-circle-left');
        $("#view").css("left", "-1%");
        $(".sidebar").css("transition-delay", "0.2s");
        $(".sidebar").css("width", "1.2%");
        $("#filter-container").css("transition", "0s");
        $(".graphics").css("transition", "0s");
        $("#filter-container").css("transition-delay", "0s");
        $(".graphics").css("transition-delay", "0s");
        $("#filter-container").css("transform", "scale(0)");
        $(".graphics").css("transform", "scale(0)");
        $(".leaflet-right").css("margin-right", "1%");
        $(".table_data_container").css("transition-delay", "0.2s");
        $(".table_data_container").css("width", "99%");
      }
      if (status_view_condensed) { // Condensed
        $('#view').removeClass('view-condensed');
        $('#view').addClass('view-normal');
        $("#view").css("left", "0%");
        $(".sidebar").css("transition-delay", "0.2s");
        $(".sidebar").css("width", "30%");
        $(".leaflet-right").css("margin-right", "30%");
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("width", "70%");
        $("#filter-container").css("transition", "2s");
        $(".graphics").css("transition", "1s");
        $("#filter-container").css("transition-delay", "0.3s");
        $(".graphics").css("transition-delay", "0.3s");
        $("#filter-container").css("transform", "scale(1)");
        $(".graphics").css("transform", "scale(1)");
        init_chart_doughnut();
      }
    });

    //Ventana inferior datos

    //Expandir toda la pantalla
    $("#view-data-expanded").on("click", function() {
      var status_view_condensed = $('#status-view').hasClass('status-view-condensed');
        $('#status-view').removeClass('status-view-condensed');
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("top", "8.5vh");
        $(".leaflet-right").css("display", "none");
        $(".leaflet-left").css("display", "none");
        var height_browser = window.innerHeight
        var height_card=$(".card_data").innerHeight()
        var height_table = height_browser*.923 - height_card -50
        $(".table_scroll").css("height", height_table);
        if(status_view_condensed){
          $("#collapse_data").css("max-height", "100vh");
          $("#collapse_data").css("transition", "2s");
          $("#collapse_data").css("transition-delay", "0.6s");
          $("#collapse_data").css("border", "1px solid rgba(0,0,0,0.6)");
          $(".leaflet-control-scale-line").css("display", "none");
          $(".leaflet-control-attribution").css("display", "none");
          init_data_dashboard(false);
        }
    });
    //Minimizar la pantalla
    $("#view-data-hidden").on("click", function() {
      $('#status-view').addClass('status-view-condensed');
      $(".table_data_container").css("transition-delay", "0.3s");
      $(".table_data_container").css("top", "97vh");
      $("#collapse_data").css("max-height", "0vh");
      $("#collapse_data").css("transition", "0.8s");
      $("#collapse_data").css("border", "none");
      $(".leaflet-right").css("display", "block");
      $(".leaflet-left").css("display", "block");
      $(".leaflet-control-scale-line").css("display", "block");
      $(".leaflet-control-attribution").css("display", "block");
    });

    //Abrir a mitad de pantalla
    $("#view-data-middle").on("click", function() {
      var status_view_condensed = $('#status-view').hasClass('status-view-condensed');
        $('#status-view').removeClass('status-view-condensed');
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("top", "50.8vh");
        var height_browser = window.innerHeight
        var height_card=$(".card_data").innerHeight()
        var height_table = height_browser*.5 - height_card -50
        $(".table_scroll").css("height", height_table);
        $(".leaflet-right").css("display", "block");
        $(".leaflet-left").css("display", "block");
        if(status_view_condensed){
          $("#collapse_data").css("max-height", "100vh");
          $("#collapse_data").css("transition", "2s");
          $("#collapse_data").css("transition-delay", "0.6s");
          $("#collapse_data").css("border", "1px solid rgba(0,0,0,0.6)");
          $(".leaflet-control-scale-line").css("display", "none");
          $(".leaflet-control-attribution").css("display", "none");
          init_data_dashboard(false);
        }
    });


    // Redimenciona graphics según collapse de Filtros Activos
    $('#collapse_filter').on('hidden.bs.collapse', function() {
      resize_graphics()
    })
    $('#collapse_filter').on('show.bs.collapse', function() {
      $(".graphics").css("height", '500');
    })
    $('#collapse_filter').on('shown.bs.collapse', function() {
      resize_graphics()
    })


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
    resize_graphics: resize_graphics,
  }
}();
