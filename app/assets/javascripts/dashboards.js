var height_time_slider;
var height_filters;
var height_charts;

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
  var height_card=$(".card_data").innerHeight()
  var height_table = height_browser/2 - height_card -50
 // $(".table_scroll").css("height", height_table);
  height_time_slider = $('#timeslider-container').height()+4;
  $('#timeslider-container').css('height',height_time_slider);
  height_filters = $('#filter-container').height()+4;
  $('#filter-container').css('height',height_filters);
  resize_graphics();
});

// Establece alto de mapa y sidebar al cargar
$(document).ready(function() {
  var height_browser = window.innerHeight
  var height_dashboard = height_browser - 60
  $("#map").css("height", height_dashboard);
  height_time_slider = $('#timeslider-container').height()+4;
  $('#timeslider-container').css('height','0px');
  height_filters = $('#filter-container').height()+4;
  $('#filter-container').css('height','0px');
  resize_graphics();
  $('#charts-container').css('height','0px');
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
  user_name: '',
  has_field_errors: '',
  field_geometric_calculated: [],
  field_geometric_calculated_all: [],
  field_geometric_calculated_length: 0,
  field_geometric_calculated_length_all: 0,
  field_geometric_calculated_count: 0,
  field_geometric_calculated_count_all: 0,
  app_ids_table: []
};

resize_graphics = function(){
  // Modificamos el alto de graphics según el alto de filter_container si está visible
  if($('#sidebar_all').hasClass('charts-container') || $('#sidebar_all').hasClass('charts-container_expanded')){
    var height_browser = window.innerHeight
    var height_time_slider = $("#timeslider-container").height();
    var height_filters = $("#filter-container").height();
    var height_header = $(".navbar").height();
    height_charts = height_browser - height_time_slider - height_filters - height_header - 40;
    $(".graphics").css("height", height_charts);
    var height_charts_container = height_charts + 40;
    $('#charts-container').css('height',height_charts_container);
  }
}

resize_filters = function(){
  // Modificamos el alto de filters y lo colocamos visible
  if(!$('#sidebar_all').hasClass('filters-container') || !$('#sidebar_all').hasClass('filters-container_expanded')){
    $('#view-filters').click();
    $("#filter-container").css('height','auto');
    height_filters = $("#filter-container").height();
    $("#filter-container").css('height',height_filters);
  }
}

set_layer_filter = function(){
  // coloca las capas como filtradas
  $('.layer_filter_switch').each(function(){
    if(!$(this).prop("checked")) {
      $('.layer_filter_switch').click();
    }
  })
}

remove_layer_filter = function(){
  // coloca las capas como NO filtradas
  $('.layer_filter_switch').each(function(){
    if($(this).prop("checked")) {
      $('.layer_filter_switch').click();
    }
  })
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
      Navarra.geomaps.get_zoomextent();
      Navarra.geomaps.wms_filter();
      Navarra.geomaps.point_colors_data();
      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }
      //Navarra.geomaps.current_layer();
      Navarra.geomaps.layers_external();
      Navarra.geomaps.layers_internal();

      resize_filters();
      resize_graphics();
    });

    // Desactiva Mapa de Calor
    $("#filter-body").on("click", '#close_heatmap_filter', function() {

      $(".fa-fire").css("color", "#9b9b9b");
      Navarra.project_types.config.field_point_colors = '';
      Navarra.project_types.config.heatmap_field = '';
      $('#heatmap_filter').remove();
      Navarra.geomaps.remove_heatmap();

      resize_filters();
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
      $(this).remove();
      if($(".filter_container").length==0){
        $(".fa-search-location").css("color", "#9b9b9b");
        //elimina los filtros del modal de capas
        remove_layer_filter();
      } else{
        $(".fa-search-location").css("color", "#d3d800");
      }
      Navarra.geomaps.get_zoomextent();
      Navarra.geomaps.wms_filter();

      // TODO: Esto se debería revisar cuando se actualice la herramienta de colorear puntos
      // Navarra.project_types.config.field_point_colors = '';
      // Navarra.geomaps.point_colors_data();

      var heatmap_actived = Navarra.project_types.config.heatmap_field;
      if (heatmap_actived != '') {
        Navarra.geomaps.heatmap_data();
      }
      resize_filters();
      resize_graphics();
    });

    $("#hide_side").on("click", function(){

          $(".side_left").slideToggle("slow");
      })
    var  project_id = $("#data_id").val();


    //Ventana inferior datos
    //Expandir toda la pantalla
    $("#view-data-expanded").on("click", function() {
      $(".table_data_container").css("background", "rgba(0, 0, 0, 0.2)");
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
          init_data_dashboard(false);
        }
        verify_scroll_table();
    });
    //Minimizar la pantalla
    $("#view-data-hidden").on("click", function() {
      $('#status-view').addClass('status-view-condensed');
      $(".table_data_container").css("transition-delay", "0.3s");
      $(".table_data_container").css("background", "transparent");
      $(".table_data_container").css("top", "97vh");
      $("#collapse_data").css("max-height", "0vh");
      $("#collapse_data").css("transition", "0.8s");
      $("#collapse_data").css("border", "none");
      $(".leaflet-right").css("display", "inline-flex");
      $(".leaflet-left").css("display", "block");
      $(".leaflet-control-scale-line").css("display", "block");
    });

    //Abrir a mitad de pantalla
    $("#view-data-middle").on("click", function() {
      $(".table_data_container").css("background", "rgba(0, 0, 0, 0.2)");
      var status_view_condensed = $('#status-view').hasClass('status-view-condensed');
        $('#status-view').removeClass('status-view-condensed');
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("top", "50.8vh");
        var height_browser = window.innerHeight
        var height_card=$(".card_data").innerHeight()
        var height_table = height_browser*.5 - height_card -50
        $(".table_scroll").css("height", height_table);
        $(".leaflet-right").css("display", "inline-flex");
        $(".leaflet-left").css("display", "block");
        if(status_view_condensed){
          $("#collapse_data").css("max-height", "100vh");
          $("#collapse_data").css("transition", "2s");
          $("#collapse_data").css("transition-delay", "0.6s");
          $("#collapse_data").css("border", "1px solid rgba(0,0,0,0.6)");
          $(".leaflet-control-scale-line").css("display", "none");
          init_data_dashboard(false);
        }
        verify_scroll_table();
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
    resize_graphics: resize_graphics,
    height_time_slider: height_time_slider,
    height_filters: height_filters,
    height_charts: height_charts,
    set_layer_filter: set_layer_filter,
    remove_layer_filter: remove_layer_filter
  }
}();
