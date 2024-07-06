var height_time_slider;
var height_filters;
var height_charts;
var open_table_middle;
var xhr_filter = null;

$(document).ready(function () {
    $.fakeLoader({
        bgColor: 'rgba(0, 0, 0, 0.5)',
        spinner:"spinner2",
    });
});

// Establece alto de mapa y sidebar al redimensionar
$(window).on('resize', function() {
  if($(".table_data_container").offset() != undefined){
    var height_browser = window.innerHeight
    var height_dashboard = height_browser - $('#nav_bar').innerHeight();
    $("#map").css("height", height_dashboard);
    var height_card=$(".card_data").innerHeight()
    var height_table = height_browser/2 - height_card -50
    resize_graphics();
    //altura de tabla
    if(!$('#status-view').hasClass('status-view-condensed')){
      if($('#status-view').hasClass('status-view-expanded')){
        $(".table_data_container").css("top", $("#nav_bar").innerHeight());
        var height_table = height_browser - $("#nav_bar").innerHeight() - height_card - 50;
        $("#table_visible_container").css("height", height_table);
      } else {
        var height_table = height_browser*.5 - height_card - 50;
        $("#table_visible_container").css("height", height_table);
      }
      setTimeout(function(){
        var height_browser = window.innerHeight;
        if($(".table_data_container").innerHeight() + $(".table_data_container").offset().top>height_browser){
          var new_height = (parseInt($('#table_visible_container').css('height')) - 30 ) + 'px';
          $('#table_visible_container').css('height',new_height);
        }
      },2000);
    }
  }
});

$(document).ready(function() {
  // Establece alto de mapa y sidebar al cargar
  $('#timeslider-container').removeClass('d-none');
  $('#filter-container').removeClass('d-none');
  $('#charts-container').removeClass('d-none');
  var height_browser = window.innerHeight;
  var height_dashboard = height_browser - $('#nav_bar').innerHeight();
  $("#map").css("height", height_dashboard);
  height_time_slider = $('#timeslider-container').height()+4;
  $('#timeslider-container').css('height','0px');
  height_filters = $('#filter-container').height()+4;
  $('#filter-container').css('height','0px');
  resize_graphics();
  $('#charts-container').css('height','0px');

  // Establece funciones para que el mensaje Toast aparezca y se oculte sin obstaculizar el mapa
  $('.toast').on('hide.bs.toast', function () {
    $(this).css('top','-30vh');
  });
  $('.toast').on('show.bs.toast', function () {
    $(this).css('top','9vh');
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
  app_ids_table: [],
  geo_key: ''
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

var search_filtered_form_ids = function() {
  if (xhr_filter && xhr_filter.readyState != 4) {
    xhr_filter.abort();
  }
  xhr_filter = $.ajax({
    type: 'GET',
    url: '/project_types/get_filtered_form_ids',
    datatype: 'json',
    data: {
      project_type_id: Navarra.dashboards.config.project_type_id,
      filtered_form_ids_text: Navarra.project_types.config.attribute_filters_subforms
    },
    success: function(data) {
      Navarra.project_types.config.filtered_form_ids = data.data;
      init_filters();
    }
  });
}

var init_filters = function(){
  var point_color = Navarra.project_types.config.field_point_colors;
  if (point_color == '') {
    Navarra.geomaps.get_zoomextent();
    Navarra.geomaps.wms_filter();
  } else {
    Navarra.geomaps.get_zoomextent();
    Navarra.geomaps.point_colors_data();
  }
  var heatmap_actived = Navarra.project_types.config.heatmap_field;
    if (heatmap_actived != '') {
      Navarra.geomaps.heatmap_data();
  }
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
        init_filters();
      } else {
        current_filters = Navarra.project_types.config.attribute_filters_subforms;
        filter_to_remove = $(this).attr('value');
        current_filters.forEach(function(f,index){
          var key = Object.keys(f)[0];
          var value = f[key];
          if(value == filter_to_remove){
            current_filters.splice(index,1);
            return;
          }
        })

        Navarra.project_types.config.attribute_filters_subforms = current_filters;
        search_filtered_form_ids();
      }
      $(this).remove();
      if($(".filter_container").length==0){
        $(".fa-search-location").css("color", "#9b9b9b");
        //elimina los filtros del modal de capas
        remove_layer_filter();
      } else{
        $(".fa-search-location").css("color", "#d3d800");
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
      $('#status-view').addClass('status-view-expanded');
      $(".table_data_container").css("background", "rgba(39, 43, 48, 0.8)");
      var status_view_condensed = $('#status-view').hasClass('status-view-condensed');
        $('#status-view').removeClass('status-view-condensed');
        $(".table_data_container").css("transition-delay", "0s");
        $(".table_data_container").css("top", $("#nav_bar").innerHeight());
        $(".leaflet-right").css("display", "none");
        $(".leaflet-left").css("display", "none");
        $(".status_panel").addClass("d-none");
        adjust_table_height();
        verify_height_table();
        if($('#sidebar_all').hasClass('charts-container') || $('#sidebar_all').hasClass('timeslider-container') || $('#sidebar_all').hasClass('filter-container') ){
          $(".table_data_container").css("width", "70%");
        }
        if($('#sidebar_all').hasClass('charts-container_expanded') || $('#sidebar_all').hasClass('timeslider-container_expanded') || $('#sidebar_all').hasClass('filter-container_expanded')){
          $(".table_data_container").css("width", "40%");
        }
        if(status_view_condensed){
          $("#collapse_data").css("max-height", "100vh");
          $("#collapse_data").css("transition", "2s");
          $("#collapse_data").css("transition-delay", "0.6s");
          $("#collapse_data").css("border", "1px solid rgba(0,0,0,0.6)");
          $(".leaflet-control-scale-line").css("display", "none");
          $(".status_panel").css("max-height", "32vh");
          init_data_dashboard(false);
        }
    });
    //Minimizar la pantalla
    $("#view-data-hidden").on("click", function() {
      $('#status-view').addClass('status-view-condensed');
      $('#status-view').removeClass('status-view-expanded');
      $(".table_data_container").css("transition-delay", "0.3s");
      $(".table_data_container").css("background", "transparent");
      $(".table_data_container").css("top", "97vh");
      $("#collapse_data").css("max-height", "0vh");
      $("#collapse_data").css("transition", "0.8s");
      $("#collapse_data").css("border", "none");
      $(".leaflet-right").css("display", "inline-flex");
      $(".leaflet-left").css("display", "block");
      $(".status_panel").removeClass("d-none");
      $(".leaflet-control-scale-line").css("display", "block");
      $(".status_panel").css("max-height", "none");
      $('#customLayerModal').css('height', 'calc(100% - 58px)');
    });

    //Abrir a mitad de pantalla
    $("#view-data-middle").on("click", function() {
      open_table_middle(false);
    });

    $(".graphics").on('click','canvas',function(){
          value_graph = $(this).attr("id");
          canvas_edit = this;
          project_type_id = Navarra.dashboards.config.project_type_id;
          dashboard_id = Navarra.dashboards.config.dashboard_id;
          graphic_id = value_graph.split('canvas');
          $.getScript("/project_types/"+ project_type_id+"/dashboards/"+dashboard_id+"/graphics/"+graphic_id[1]+"/edit");
        });
    $.ajax({
      type: 'GET',
      url: '/project_types/get_geo_key',
      datatype: 'json',
      success: function(data) {
        Navarra.dashboards.config.geo_key = data.data;
        Navarra.geomaps.init();
        set_layer_modal();
      }
    });
  }


function verify_height_table(){
  setTimeout(function(){
    var height_browser = window.innerHeight;
    if($(".table_data_container").innerHeight() + $(".table_data_container").offset().top>height_browser){
      var new_height = (parseInt($('#div_table_data').css('height')) - 30 ) + 'px';
      $('#div_table_data').css('height',new_height);
    }
  },2000);
}

open_table_middle = function(only_open){
  $(".table_data_container").css("background", "rgba(39, 43, 48, 0.8)");
    var status_view_condensed = $('#status-view').hasClass('status-view-condensed');
    $('#status-view').removeClass('status-view-condensed');
    $('#status-view').removeClass('status-view-expanded');
    $(".table_data_container").css("transition-delay", "0s");
    $(".table_data_container").css("top", "50vh");
    adjust_table_height();
    verify_height_table();
    $(".leaflet-right").css("display", "inline-flex");
    $(".leaflet-left").css("display", "block");
    $(".status_panel").removeClass("d-none");
    if(status_view_condensed){
      $("#collapse_data").css("max-height", "100vh");
      $("#collapse_data").css("transition", "2s");
      $("#collapse_data").css("transition-delay", "0.6s");
      $("#collapse_data").css("border", "1px solid rgba(0,0,0,0.6)");
      $(".leaflet-control-scale-line").css("display", "none");
      $(".status_panel").css("max-height", "32vh");
      if(!only_open){
        init_data_dashboard(false);
      }
    }
    if(!$('#sidebar_all').hasClass('charts-container_expanded')){
      $(".table_data_container").css("width", "70%");
    }
    if(!$('#sidebar_all').hasClass('charts-container') && !$('#sidebar_all').hasClass('charts-container_expanded') ){
      $(".table_data_container").css("width", "100%");
    }
}

  return {
    init: init,
    resize_graphics: resize_graphics,
    height_time_slider: height_time_slider,
    height_filters: height_filters,
    height_charts: height_charts,
    set_layer_filter: set_layer_filter,
    remove_layer_filter: remove_layer_filter,
    open_table_middle: open_table_middle,
    init_filters: init_filters,
    search_filtered_form_ids: search_filtered_form_ids
  }
}();
