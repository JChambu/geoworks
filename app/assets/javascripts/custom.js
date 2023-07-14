//peticiones Ajax
var xhr_kpi = [];
var xhr_chart = [];
for(x=0;x<1000;x++){
  xhr_kpi.push(null);
  xhr_chart.push(null)
}
var xhr_table = null;
var xhr_geojson = null;
var xhr_table_search = null;
var xhr_info = null;
var xhr_report = null;
var data_charts;
var filechange;
var statuschange;
var original_chart_container;

var scroll_chart = 0;
var father_fields = [];
var child_elements = [];
var children_fields;
var children_fields_all;
var array_child_edited;
var data_dashboard=[];
var subtitles_all = [];
var subtitles_all_child = [];
var arraymultiselect=[];
var arraymultiselectChild=[];
var verify_count_elements_childs = 0;
var array_datos = [];
var array_column_hidden = [];
var subheader_open = [];
var time_slider_data_subform;
var time_slider_data;
var data_gx_all;

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function init_kpi(size_box = null) {
  $('#div_pagination').css("visibility","hidden");
  $('.tile_count').empty();
  var type_box = 'polygon';
  var data_conditions = {}

  if (size_box == null && Navarra.project_types.config.project_field == '') {
    size_box = [];
    type_box = 'extent';
    size_ext = Navarra.dashboards.config.size_box;
    size_box[0] = size_ext['_southWest']['lng'];
    size_box[1] = size_ext['_southWest']['lat'];
    size_box[2] = size_ext['_northEast']['lng'];
    size_box[3] = size_ext['_northEast']['lat'];
  }

  var data_id = Navarra.dashboards.config.project_type_id;
  var dashboard_id = Navarra.dashboards.config.dashboard_id;
  var attribute_filters = Navarra.project_types.config.attribute_filters;
  var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
  var from_date = Navarra.project_types.config.from_date;
  var to_date = Navarra.project_types.config.to_date;
  var from_date_subforms = Navarra.project_types.config.from_date_subforms;
  var to_date_subforms = Navarra.project_types.config.to_date_subforms;
  var filter_children = [];
  var filter_user_children = [];
  var intersect_width_layers = $('#switch_intersect_layers').is(":checked");
  var active_layers = get_active_layers();
  $('.subform_filter').each(function(){
    if(!isNaN($(this).attr('id').split('|')[0])){
      filter_children.push($(this).attr('id'));
    }else {
      filter_user_children.push($(this).attr('id').split('|')[2])
    }
  });
  $.ajax({
    type: 'GET',
    url: '/project_types/get_kpi_without_graph_ids.json',
    datatype: 'json',
    data: {
      project_type_id: Navarra.dashboards.config.project_type_id,
      is_graph: false
    },
    success: function(data) {
      var indicators_id = data.data;
      html = '';
      html += '<div class="text-center tile_stats_count invisible" id="indicator_container_default0"></div>'
      html += '<div class="text-center tile_stats_count invisible" id="indicator_container_default1"></div>'
      html += '<div class="text-center tile_stats_count invisible" id="indicator_container_default2"></div>'
      indicators_id.forEach(function(indicator_id){
          html += '<div class="text-center tile_stats_count invisible" id="indicator_container'+indicator_id+'"></div>'
      });
      $('.tile_count').append(html);
      xhr_kpi.forEach(function(xhr_k){
        if(xhr_k && xhr_k.readyState != 4) {
          xhr_k.abort();
        }
      })
      // indicadores por default
      xhr_kpi[0] = $.ajax({
        type: 'POST',
        url: '/project_types/kpi.json',
        datatype: 'json',
        data: {
          is_default: true,
          data_id: data_id,
          size_box: size_box,
          graph: false,
          type_box: type_box,
          data_conditions: attribute_filters,
          filtered_form_ids: filtered_form_ids,
          from_date: from_date,
          to_date: to_date,
          from_date_subform: from_date_subforms,
          to_date_subform: to_date_subforms,
          filter_children:filter_children,
          filter_user_children:filter_user_children,
          indicator_id: 0,
          timeslider_layers: Navarra.project_types.config.timeslider_layers,
          filters_layers: Navarra.project_types.config.filters_layers,
          intersect_width_layers: intersect_width_layers,
          active_layers: active_layers
        },
        dashboard_id: dashboard_id,
          success: function(data) {
            data.forEach(function(element, index) {
              set_kpi_navbar(element, true , index)
            }); // Cierra forEach
            $('#div_pagination').css("visibility","visible");
            // indicadores generados por el usuario
            indicators_id.forEach(function(indicator_id,index_kpi){
              xhr_kpi[index_kpi+1] = $.ajax({
                type: 'POST',
                url: '/project_types/kpi.json',
                datatype: 'json',
                data: {
                  is_default: false,
                  data_id: data_id,
                  size_box: size_box,
                  graph: false,
                  type_box: type_box,
                  data_conditions: attribute_filters,
                  filtered_form_ids: filtered_form_ids,
                  from_date: from_date,
                  to_date: to_date,
                  from_date_subform: from_date_subforms,
                  to_date_subform: to_date_subforms,
                  filter_children:filter_children,
                  filter_user_children:filter_user_children,
                  indicator_id: indicator_id,
                  timeslider_layers: Navarra.project_types.config.timeslider_layers,
                  filters_layers: Navarra.project_types.config.filters_layers,
                  intersect_width_layers: intersect_width_layers,
                  active_layers: active_layers
                },
                dashboard_id: dashboard_id,
                success: function(data) {
                  data.forEach(function(element) {
                    set_kpi_navbar(element, false , indicator_id)
                  }); // Cierra forEach
                } // Cierra success
              }); // Cierra ajax
            }); // Cierra forEach
          } // Cierra success de indicadores por default
        }); // Cierra ajax de indicadores por default
    }// Cierra success ids de indicadores
  }); // Cierra ajax para buscar ids de indicadores
}; // Cierra init_kpi

function set_kpi_navbar(element,is_default, indicator_id){
  var count_element = element['data'][0]['count'];
  if (element['title'] == 'Seleccionado') {
    if ($("#choose").val() == "") {
      if ($(".active_page").length == 0) {
        var active_page = 1
      } else {
        var active_page = parseInt($(".active_page").html());
      }
      data_pagination(element['data'][0]['count'], active_page);
    }
    $('.total_files').val(element['data'][0]['count']);
  }
  var count_element_number = parseFloat(count_element);
  if(count_element!=null){
    var count_element_text = count_element.toString().split(count_element_number)[1];
    if (count_element_text == undefined ){count_element_text = ''}
    if (Number(count_element_number) != parseInt(Number(count_element_number))) {
      data_cont = (Number(count_element_number)).format(2, 3, '.', ',')+count_element_text;
    } else {
      data_cont = (Number(count_element_number)).format(0, 3, '.', ',')+count_element_text;
    }
  } else {
    data_cont = '';
  }



    if(element['title'].split(' ').length>=2){
      var split_element = Math.ceil(element['title'].split(' ').length/2);
      var title_up = "";
      var title_down = "";
      element['title'].split(' ').forEach(function(element, index){
        if(index<split_element){
          title_up += element+" ";
        } else{
          title_down += element+" ";
        }
      })
      var element_title_two_lines = "<p class='m-0 text-left'>"+title_up+"</p><p class='m-0 mb-1 text-left'>"+title_down+"</p>";
    } else {
      var element_title_two_lines = "<p class='m-0 position-relative text-left' style='top:5px'>"+element['title']+"</p><p class='m-0 mb-1 invisible'>"+element['title']+"</p>";
    }
    html = '<span class="count_top align-top">' + element_title_two_lines + '</span>' +
      '<div class="count align-middle kpi_' + element['id'] + '"> ' + data_cont + '</div>' +
      '</div>'
    if(is_default == true){
      $('#indicator_container_default'+indicator_id).append(html);
      $('#indicator_container_default'+indicator_id).removeClass('invisible');
    } else {
      $('#indicator_container'+indicator_id).append(html);
      $('#indicator_container'+indicator_id).removeClass('invisible')
    }
    var width_element = $('.custom_indicator_container').outerWidth();
    var width_parent = $('.custom_indicator_container').parent().parent().outerWidth();
    if(width_element>width_parent){
      $('#move_indicators_left').removeClass('d-none');
      $('#move_indicators_right').removeClass('d-none');
    }
}

function capitalize(s) {
  return s.toLowerCase().replace(/\b./g, function(a) {
    return a.toUpperCase();
  });
};

function init_chart_doughnut(size_box = null, create_time_s = true) {
  // no calcula la función si los gráficos están escondidos
  if (!$('#sidebar_all').hasClass('charts-container') && !$('#sidebar_all').hasClass('charts-container_expanded')) {
    return;
  }
  $(".chart_body_custom").css("visibility","hidden");
   html = ' <div class="d-flex justify-content-center" style= "position: absolute;width:100%; height:190px; align-items:center">'+
          '<div class="spinner-border" role="status">'+
          '<span class="sr-only">Loading...</span>'+
          '</div></div>';
  $('.chart_container').append(html);
  // Guardamos la posición del scroll
  var scroll = $('.graphics').scrollTop();

  if (typeof(Chart) === 'undefined') {
    return;
  }

  if ($('.graphics').length) {

    // Establece el size_box para extent
    if (Navarra.dashboards.config.size_polygon.length == 0) {

      size_box = [];
      var type_box = 'extent';
      size_ext = Navarra.dashboards.config.size_box;
      size_box[0] = size_ext['_southWest']['lng'];
      size_box[1] = size_ext['_southWest']['lat'];
      size_box[2] = size_ext['_northEast']['lng'];
      size_box[3] = size_ext['_northEast']['lat'];

      // Establece el size_box para polygon
    } else {

      var type_box = 'polygon';
      size_box = size_polygon

    }

    var data_id = Navarra.dashboards.config.project_type_id;
    var dashboard_id = Navarra.dashboards.config.dashboard_id;
    var attribute_filters = Navarra.project_types.config.attribute_filters;
    var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
    var from_date = Navarra.project_types.config.from_date;
    var to_date = Navarra.project_types.config.to_date;
    var from_date_subforms = Navarra.project_types.config.from_date_subforms;
    var to_date_subforms = Navarra.project_types.config.to_date_subforms;
    var filter_children = [];
    var filter_user_children = [];
    var intersect_width_layers = $('#switch_intersect_layers').is(":checked");
    var active_layers = get_active_layers();
    $('.subform_filter').each(function(){
    if(!isNaN($(this).attr('id').split('|')[0])){
      filter_children.push($(this).attr('id'));
      }else {
        filter_user_children.push($(this).attr('id').split('|')[2])
      }
    });
    xhr_chart.forEach(function(xhr_c){
        if(xhr_c && xhr_c.readyState != 4) {
          xhr_c.abort();
        }
      })

    // Busca id de gráficos
      xhr_chart[0] = $.ajax({
        type: 'GET',
        url: '/project_types/get_kpi_without_graph_ids.json',
        datatype: 'json',
        data: {
          project_type_id: Navarra.dashboards.config.project_type_id,
          is_graph: true
        },
        success: function(data) {
          data_gx_all = [];
          var graph_ids = data.data;
          //creamos los divs ordenados
          $(".chart_container").remove();
          graph_ids.forEach(function(id_graph){
            $('.graphics').append(
              $('<div>', {
                'class': 'card text-light p-0 mt-1 chart-bg-none chart_container',
                'id': 'chart_container' + id_graph
              })
            )
          });
          // cicla los gráficos uno por uno
          graph_ids.forEach(function(id_graph, index_graph){
            xhr_chart[index_graph] = $.ajax({
              type: 'POST',
              url: '/project_types/kpi.json',
              datatype: 'json',
              data: {
                graph_id: id_graph,
                data_id: data_id,
                size_box: size_box,
                graph: true,
                type_box: type_box,
                dashboard_id: dashboard_id,
                data_conditions: attribute_filters,
                filtered_form_ids: filtered_form_ids,
                from_date: from_date,
                to_date: to_date,
                from_date_subform: from_date_subforms,
                to_date_subform: to_date_subforms,
                filter_children:filter_children,
                filter_user_children:filter_user_children,
                timeslider_layers: Navarra.project_types.config.timeslider_layers,
                filters_layers: Navarra.project_types.config.filters_layers,
                intersect_width_layers: intersect_width_layers,
                active_layers: active_layers
              },
              success: function(data) {
                data_charts = data;
                draw_charts(data);

              } //cierra function data
            }) //cierra ajax
          })
        }
      });
  } //cierra if graphics
  $('.modal-backdrop').remove();

} //cierra function init_chart_doughnu

var dragAndDrop = {
  store: [],
  init: function() {

    self = this;

    if (typeof this.dragula === 'function'){
      this.dragula();
    }

    this.eventListeners();

    // querySelectorAll returns a nodelist and should be converted to array to use filter, map and foreach
    var nodesArray = Array.prototype.slice.call(document.querySelectorAll("#graph .chart_container"));

    var nodesArray = nodesArray.filter(function(e) {
      return self.store.map(function(d) {
        return d['element'];
      }).indexOf(e.id) === -1;
    }).forEach(function(e) {
      self.store.push({
        'element': e.id,
        'container': 'graph'
      });
    });

    this.store.forEach(function(obj) {
      document.getElementById(obj.container).appendChild(document.getElementById(obj.element));
    });
  },
  eventListeners: function() {
    this.dragula.on('drop', this.dropped.bind(this));
  },

  dragula: function() {
    this.dragula = dragula([document.getElementById('graph')], {
      copy: false,
    });
  },

  dropped: function(el, target, source, sibling) {
    // Remove element from store if it exists
    var indexEl = this.store.map(function(d) {
      return d['element'];
    }).indexOf(el.id);
    if (indexEl > -1)
      this.store.splice(indexEl, 1);

    var indexDrop = this.store.length;
    if (sibling) { // If sibling store before sibling
      indexDrop = this.store.map(function(d) {
        return d['element'];
      }).indexOf(sibling.id);
    }

    this.store.splice(indexDrop, 0, {
      'element': el.id,
      'container': target.id
    });

    var tstore = this.store
    var result = {}
    $.each(tstore, function(index) {
      sort = index
      graph_id = $(this)[0]['element'].replace(/chart_container/g, '')
      result[graph_id] = sort
    })
    $.ajax({
      url: '/graphics/update_sort',
      type: 'POST',
      data: {
        sort_data: result
      }
    });
    localStorage.removeItem("store");
  }
}


// función para graficar los charts
function draw_charts(data) {

  // Ordenamos las series por chart
  for (var i = 0; i < data.length; i++) {
    var reg = data[i];
    var type_chart = "";
    var title = "";
    var canvas_id;
    var graphic_id;
    var datasets = [];
    var width;
    var aspectR;
    var legend_display;
    var label_x_axis;
    var label_y_axis_left;
    var label_y_axis_right;
    var label_datasets;
    var position_y_axis;
    var right_y_axis;
    var display_right_y_axis = false;
    var tick_min_left
    var tick_max_left
    var tick_step_left
    var tick_min_right
    var tick_max_right
    var count_series = 0;
    var bubble_dataset = [];
    var bubble_dataset_x = [];
    var bubble_dataset_y = [];
    var scale;
    var data_decimals=1;

    // Agrupamos los labels y los datos para luego poder ajustar las series con los mismos valores en el eje x
    var lab_all = []; //variable que agrupa los labels de cada serie
    var da_all = []; //Variable que agrupa los datos de cada serie
    var lab_acumulado = []; //variable que acumula todos los labels de todas las series

    // Separamos las series
    $.each(reg, function(a, b) {
      // Extraemos los datos de cada serie
      $.each(b, function(index, value) {
        // Extraemos tipo de gráfico
        if (index == 'chart_type') {
          type_chart = value;
        }
        // Extraemos el array con los datos de la serie
        if (index == 'data') {
          data_general = value;
          var lab = [];
          var da = [];

          // Extraemos los datos del array de la serie
          $.each(data_general, function(idx, vax) {
            // Burbuja
            //Cuidado no está corregido para agrupar las series y chequear que los valores de y coincidan para todas la series
            if (type_chart == 'bubble') {
              //
              $.each(vax, function(i, v) {
                if (count_series == 0) {
                  bubble_dataset_x.push(v['count']);
                } else {
                  bubble_dataset_y.push(v['count']);
                }
              })

              if (count_series == 1) {
                for (var b = 0; b < vax.length; b++) {
                  r = (parseFloat(bubble_dataset_y[b]) * parseFloat(bubble_dataset_x)) * scale;
                  bubble_dataset.push({
                    "x": bubble_dataset_x[b],
                    "y": bubble_dataset_y[b],
                    "r": r
                  });
                }
              }
              count_series = 1;

              // Resto de los gráficos
            } else {

              $.each(vax, function(i, v) {
                  // Elimina los corchetes del name
                  lab_final = v['name']
                  if (lab_final != null) {
                    lab_final = lab_final.replace(/[\[\]\"]/g, "")
                  }
                  lab.push(lab_final);
                  lab_acumulado.push(lab_final);
                  da.push(v['count']);
              })
            }
            lab_all.push(lab);
            da_all.push(da);
          }); //cierra each data_general
        } //cierra if data
      }) //cierra each b
    }) //cierra each reg

    //Verifica valores del label en el eje x para unificar si hay varias series
    // también se verifica el orden de los valores numéricos
      Array.prototype.unique = function(a) {
        return function() {
          return this.filter(a)
        }
      }(function(a, b, c) {
        return c.indexOf(a, b + 1) < 0
      });

      lab_acumulado = lab_acumulado.unique(); //elimina valores duplicados
      lab_acumulado = lab_acumulado.sort(); //ordena con sort, lo que coloca los null al final
      lab_acumulado = lab_acumulado.sort(function(a, b) {
        if (a != null) {
          if(isNaN(a)){
            return a.localeCompare(b);
            } else{
              return a-b;
            }
        }
      }); //lo ordena en español para colocar la ñ en su lugar. sort() la coloca al final
      var indexnull = lab_acumulado.indexOf(null);
      if (indexnull >= 0) {
        lab_acumulado[indexnull] = 'sin datos'
      }
      for (var l = 0; l < lab_all.length; l++) { //búsqueda para todas las series
        //Ordenamos el array traído de la base de datos
        var lab_temporal_ordenado = lab_all[l].slice().sort();
        var lab_temporal_ordenado = lab_temporal_ordenado.sort(function(a, b) {
          if (a != null) {
            if(isNaN(a)){
              return a.localeCompare(b);
            } else{
              return a-b;
            }
          }
        }); //lo ordena en español
        var indexnull = lab_temporal_ordenado.indexOf(null);
        if (indexnull >= 0) {
          lab_temporal_ordenado[indexnull] = 'sin datos'
        }
        var indexnull = lab_all[l].indexOf(null);
        if (indexnull >= 0) {
          lab_all[l][indexnull] = 'sin datos'
        }
        var lab_temporal = [];
        var da_temporal = [];
        for (var t = 0; t < lab_temporal_ordenado.length; t++) {
          for (var tt = 0; tt < lab_all[l].length; tt++) {
            if (lab_temporal_ordenado[t] == lab_all[l][tt]) {
              lab_temporal.push(lab_all[l][tt]);
              da_temporal.push(da_all[l][tt]);
            }
          }
        }
        lab_all[l] = lab_temporal.slice();
        da_all[l] = da_temporal.slice();
        for (var a = 0; a < lab_acumulado.length; a++) {
          if (lab_all[l][a] != lab_acumulado[a]) {
            lab_all[l].splice(a, 0, lab_acumulado[a]); // si no encuentra el label lo agrega en el eje x
            da_all[l].splice(a, 0, null); //y agrega valor null para el eje y
          }
        }
      }

    // fin de unificación de labels en el eje x para varias series y orden numérico

    // Arranca armando series
    $.each(reg, function(a, b) {

      // Extraemos los datos de cada serie
      $.each(b, function(index, value) {

        // Extraemos tipo de gráfico
        if (index == 'chart_type') {
          type_chart = value;
        }

        // Extraemos propiedades del gráfico
        if (index == 'chart_properties') {
          options = value;
          graphic_id = value['graphic_id'];
          color = value['color'];

          label_datasets = value['label_datasets'];
          // el campo está mal cargado en la db ARREGLAR
          right_y_axis = value['left_y_axis'];
          if (right_y_axis == true) {
            display_right_y_axis = true;
            position_y_axis = 'right-y-axis';
          } else {
            position_y_axis = 'left-y-axis';
          };
          point_style = value['point_type']
        }

        // Extraemos las opciones del gráfico
        if (index == 'graphics_options') {
          title = value['title'];
          width = value['width'];
          legend_display = value['legend_display'];
          label_x_axis = value['label_x_axis'];
          label_y_axis_left = value['label_y_axis_left'];
          label_y_axis_right = value['label_y_axis_right'];
          stacked = value['stack'];
          data_labelling = value['data_labelling'];
          scale = value['scale'];
          tick_min_left = value['tick_x_min'];
          if (tick_min_left == null) {
            tick_min_left = 0;
          }
          tick_max_left = value['tick_x_max'];
          tick_min_right = value['tick_y_min'];
          if (tick_min_right == null) {
            tick_min_right = 0;
          }
          tick_max_right = value['tick_y_max'];
          tick_step_left = value['step_x'];
          if (tick_step_left == null) {
            tick_step_left = 0;
          }
        }

        if (index == 'data') {
          data_general = value;

          // Extraemos los datos del array de la serie
          $.each(data_general, function(idx, vax) {
            var idx_index = idx.substring(5)

            // BAR & LINE datasets
            if (type_chart == 'bar' || type_chart == 'line') {
              datasets.push({
                label: label_datasets,
                data: da_all[idx_index],
                yAxisID: position_y_axis,
                fill: false,
                lineTension: 0,
                pointRadius: 0,
                pointStyle: point_style,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 4,
                hoverBackgroundColor: color,
                hoverBorderColor: color,
                hoverBorderWidth: 2,
                type: type_chart
              });
            }

            //AREA datasets
            if (type_chart == 'area') {
              datasets.push({
                label: label_datasets,
                data: da_all[idx_index],
                yAxisID: position_y_axis,
                fill: true,
                lineTension: 0,
                pointStyle: point_style,
                pointRadius: 0,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 3,
                hoverBackgroundColor: color,
                hoverBorderColor: color,
                hoverBorderWidth: 2,
                type: 'line'
              });
            }

            // POINT datasets
            if (type_chart == 'point') {
              datasets.push({
                label: label_datasets,
                data: da_all[idx_index],
                yAxisID: position_y_axis,
                fill: true,
                pointStyle: point_style,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 3,
                hoverBackgroundColor: color,
                hoverBorderColor: color,
                hoverBorderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false,
                type: 'line'
              });
            }

            // HORIZONTAL BAR datasets
            if (type_chart == 'horizontalBar') {
              datasets.push({
                label: label_datasets,
                data: da_all[idx_index],
                fill: false,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 3,
                hoverBackgroundColor: color,
                hoverBorderColor: color,
                hoverBorderWidth: 2,
                type: type_chart
              });
            }

            // DOUGHNUT datasets
            if (type_chart == 'doughnut') {
              cantidad = da_all[idx_index].length;
              rancolor = randomColor({
                count: cantidad,
                hue: color,
                format: 'rgb',
                seed: 1,
              })
              datasets.push({
                label: label_datasets,
                data: da_all[idx_index],
                backgroundColor: rancolor,
                borderColor: 'white',
                borderWidth: 2,
                type: type_chart
              });
            }

            // BUBBLE datasets
            if (type_chart == 'bubble' && count_series == 1) {

              datasets.push({
                label: label_datasets,
                data: bubble_dataset,
                fill: false,
                backgroundColor: 'transparent',
                borderColor: color,
                borderWidth: 3,
                hoverBackgroundColor: color,
                hoverBorderColor: color,
                hoverBorderWidth: 2,
                type: type_chart
              });
            }

          }); //cierra each data_general

          data_gx = {
            labels: lab_acumulado,
            datasets: datasets
          }
          data_gx_all.push({
            id_graph: graphic_id,
            data_gx: data_gx
          });

        } //cierra if data
      }) //cierra each b
    }) //cierra each reg

    var html_new_graph = "<div class='w-100'>"
    html_new_graph += "<div class='py-1 px-2' id='header"+graphic_id+"'>"
    html_new_graph += "<text id='text_chart"+graphic_id+"'>"+title+"</text>"
    html_new_graph += "<span class='fas fa-expand-arrows-alt' style='float: right; cursor: pointer' onclick='maximize_chart(event)'></span>"
    html_new_graph += "<span class='fas fa-table mr-2' id='show_data_chart"+graphic_id+"' style='float: right; cursor: pointer' title='Mostrar Datos' onclick='show_data_chart("+graphic_id+")'></span>"
    html_new_graph += "<span class='fas fa-eye-slash mr-2' id='hide_chart"+graphic_id+"' style='float: right; cursor: pointer' title='Ocultar Gráfico' onclick='hide_chart("+graphic_id+")'></span>"
    html_new_graph += "</div>"
    html_new_graph += "<div class='collapse show' id='collapse_"+graphic_id+"'>"
    html_new_graph += "<div class='d-none card-body px-1 pb-0 chart_body_custom' style='overflow-x: auto' id='body_graph_table"+graphic_id+"'>"
    html_new_graph += "</div>"
    html_new_graph += "<div class='card-body px-1 pb-0 chart_body_custom' id='body"+graphic_id+"'>"
    html_new_graph += "<canvas class='canvas"+graphic_id+"' id='canvas"+graphic_id+"'></canvas>"
    html_new_graph += "</div>"
    html_new_graph += "</div>"
    html_new_graph += "</div>"

    $('#chart_container'+graphic_id).append(html_new_graph);


    //Chequeamos el estado de view
    var status_view_chart = $('#sidebar_all').hasClass('charts-container');
    var status_view_expanded_chart = $('#sidebar_all').hasClass('charts-container_expanded');
    if (status_view_chart) { // Default
      if (width == 3) {
        width = 6;
        aspectR = "1";
      } else if (width == 6) {
        aspectR = "1";
      } else if (width == 9) {
        width = 12;
        aspectR = "2";
      } else if (width == 12) {
        aspectR = "2";
      }
      $('#chart_container' + graphic_id).addClass('col-md-' + width);
      //legend_display = false;
    }
    if (status_view_expanded_chart) { // Expanded
      if (width == 3) {
        aspectR = "1";
      } else if (width == 6) {
        aspectR = "2";
      } else if (width == 9) {
        aspectR = "3";
      } else if (width == 12) {
        aspectR = "4";
      }
      $('#chart_container' + graphic_id).addClass('col-md-' + width);
      //legend_display = false;
    }
    // BAR options
    if (type_chart == 'bar' || type_chart == 'line' || type_chart == 'area' || type_chart == 'point') {
      var option_legend = {
        responsive: true,
        aspectRatio: aspectR,
        legend: {
          display: legend_display,
          position: 'bottom',
          labels: {
            boxWidth: 40,
            padding: 10,
            usePointStyle: true,
            fontColor: '#fff',
          }
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var currentValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return currentValue.toLocaleString('es-ES');
            }
          }
        },
        scales: {
          xAxes: [{
            stacked: stacked,
            ticks: {
              autoSkip: false,
              fontColor: '#FDFEFE'
            },
            gridLines: {
              color: "#626567"
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: label_x_axis,
              fontColor: '#e9ecef',
            }
          }],
          yAxes: [{
            id: 'left-y-axis',
            position: 'left',
            display: 'true',
            type: 'linear',
            ticks: {
              min: parseFloat(tick_min_left),
             stepSize: parseFloat(tick_step_left),
                callback: function(label, index, labels) {
                  label = label.toLocaleString('es-ES')
                  return label;
                },
              fontColor: '#FDFEFE'
            },
            /*
            beforeBuildTicks: function(scale) {
              // Aplica ticks custom si se ingresan valores
              if (tick_min_left == null) {
                scale.min = 0
              } else {
                scale.min = parseInt(tick_min_left)
              }
              if (tick_max_left != null) {
                scale.max = parseInt(tick_max_left)
              }
              return;
            },
            */
            stacked: stacked,
            scaleLabel: {
              display: true,
              labelString: label_y_axis_left,
              fontColor: '#e9ecef',
            },
            gridLines: {
              color: "#626567",
              drawOnChartArea: true,
            },
          }, {
            id: 'right-y-axis',
            position: 'right',
            display: display_right_y_axis,
            type: 'linear',
            ticks: {
              min: parseFloat(tick_min_right),
              stepSize: parseFloat(tick_step_left),
              callback: function(label, index, labels) {
                label = label.toLocaleString('es-ES')
                return label;
              },
              fontColor: '#FDFEFE',
            },
            /*
            beforeBuildTicks: function(scale) {
              // Aplica ticks custom si se ingresan valores
              if (tick_min_right == null) {
                scale.min = 0
              } else {
                scale.min = parseInt(tick_min_right)
              }
              if (tick_max_right != null) {
                scale.max = parseInt(tick_max_right)
              }
              return;
            },
            */
            stacked: stacked,
            scaleLabel: {
              display: true,
              labelString: label_y_axis_right,
              fontColor: '#e9ecef',
            },
            gridLines: {
              color: "#626567",
              drawOnChartArea: false,
            },
          }]
        },
        plugins: {
          datalabels: {
            display: data_labelling,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'white',
            textStrokeColor: '#1B2631',
            textStrokeWidth: 1,
            textShadowColor: '#000000',
            textShadowBlur: 5,
            anchor: 'end',
            align: 'end',
            offset: -5,
            formatter: function(value, context) {
              var datasets_context = context.dataset.data;
              var max = Math.max.apply(null, datasets_context);
              var min = Math.min.apply(null, datasets_context);
              if(max-min<=50){data_decimals=10}
              if(max-min<=10){data_decimals=100}
              if(max-min<=5){data_decimals=1000}
              return Math.round(value*data_decimals)/data_decimals;
            }
          }
        },
      }
      if (tick_max_left != null) {
        option_legend.scales.yAxes[0].ticks.max = parseFloat(tick_max_left);
      }
      if (tick_max_right != null) {
        option_legend.scales.yAxes[1].ticks.max = parseFloat(tick_max_right);
      }
      var chart_settings = {
        type: 'bar',
        data: data_gx,
        options: option_legend
      }
    }

    // HORIZONTAL BAR datasets
    if (type_chart == 'horizontalBar') {
      var option_legend = {
        responsive: true,
        aspectRatio: aspectR,
        legend: {
          display: legend_display,
          position: 'bottom',
          labels: {
            boxWidth: 40,
            padding: 10,
            usePointStyle: true,
            fontColor: '#fff',
          }
        },
        scales: {
          xAxes: [{
            display: true,
            ticks: {
              min: parseFloat(tick_min_left),
              stepSize: parseFloat(tick_step_left),
              callback: function(label, index, labels) {
                label = label.toLocaleString('es-ES')
                return label;
              },
              fontColor: '#FDFEFE'
            },
            /*
            beforeBuildTicks: function(scale) {
              // Aplica ticks custom si se ingresan valores
              if (tick_min_left == null) {
                scale.min = 0
              } else {
                scale.min = parseInt(tick_min_left)
              }
              if (tick_max_left != null) {
                scale.max = parseInt(tick_max_left)
              }
              return;
            },
            */
            stacked: stacked,
            scaleLabel: {
              display: true,
              labelString: label_y_axis_left, // invertido para horizontalBar
              fontColor: '#e9ecef',
            },
            gridLines: {
              drawOnChartArea: true,
              color: "#626567",
            },
          }],
          yAxes: [{
            display: true,
            stacked: stacked,
            scaleLabel: {
              display: true,
              labelString: label_x_axis, // invertido para horizontalBar
              fontColor: '#e9ecef',
            },
            ticks: {
              autoSkip: false,
              fontColor: '#FDFEFE'
            },
            gridLines: {
              color: "#626567"
            },
          }]
        },
        plugins: {
          datalabels: {
            display: data_labelling,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'white',
            textStrokeColor: '#1B2631',
            textStrokeWidth: 1,
            textShadowColor: '#000000',
            textShadowBlur: 5,
            anchor: 'end',
            align: 'end',
            formatter: function(value, context) {
              var datasets_context = context.dataset.data;
              var max = Math.max.apply(null, datasets_context);
              var min = Math.min.apply(null, datasets_context);
              if(max-min<=50){data_decimals=10}
              if(max-min<=10){data_decimals=100}
              if(max-min<=5){data_decimals=1000}
              return Math.round(value*data_decimals)/data_decimals;
            }
          }
        },
      }
      if (tick_max_left != null) {
        option_legend.scales.yAxes[0].ticks.max = parseFloat(tick_max_left);
      }
      var chart_settings = {
        type: 'horizontalBar',
        data: data_gx,
        options: option_legend
      }
    }

    // DOUGHNUT options
    if (type_chart == 'doughnut') {
      var option_legend = {
        responsive: true,
        aspectRatio: aspectR,
        legend: {
          display: legend_display,
          position: 'bottom',
          labels: {
            fontColor: '#3d4046',
            fontSize: 12,
            usePointStyle: true,
            fontColor: '#fff',
          }
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItem, data) {
              return data.labels[tooltipItem[0].index];
            },
            label: function(tooltipItem, data) {
              // Obtenemos los datos
              var dataset = data.datasets[tooltipItem.datasetIndex];
              // Calcula el total
              var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                // Convierte string a float
                previousValue = parseFloat(previousValue)
                currentValue = parseFloat(currentValue)
                return previousValue + currentValue;
              });
              // Obtenemos el valor de los elementos actuales
              var currentValue = dataset.data[tooltipItem.index];
              // Calculamos el porcentaje
              var precentage = ((currentValue / total) * 100).toFixed(2)
              return precentage + "%";
            }
          }
        },
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              // Mustra sólo los labels cuyo valor sea mayor al 4%
              let sum = 0;
              var label = ctx.chart.data.labels[ctx.dataIndex]
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map(data => {
                sum += data;
              });
              let percentage = (value * 100 / sum).toFixed(2);
              if (percentage > 4) {
                return label;
              } else {
                return null;
              }
            },
            font: {
              size: 11,
            },
            textStrokeColor: '#616A6B',
            color: '#FDFEFE',
            textStrokeWidth: 1,
            textShadowColor: '#000000',
            textShadowBlur: 2,
            align: 'center',
          }
        },
      }
      var chart_settings = {
        type: type_chart,
        data: data_gx,
        options: option_legend
      }
    }

    // BUBBLE options
    if (type_chart == 'bubble') {
      var option_legend = {
        responsive: true,
        aspectRatio: aspectR,
        legend: {
          display: legend_display,
          position: 'bottom',
          labels: {
            boxWidth: 40,
            padding: 10,
            usePointStyle: true,
            fontColor: '#fff',
          }
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: label_x_axis
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: label_y_axis_left
            }
          }]
        },
        plugins: {
          datalabels: {
            display: data_labelling,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'white',
            textStrokeColor: '#1B2631',
            textStrokeWidth: 1,
            textShadowColor: '#000000',
            textShadowBlur: 5,
            anchor: 'end',
            align: 'end',
            formatter: function(value, context) {
              var datasets_context = context.dataset.data;
              var max = Math.max.apply(null, datasets_context);
              var min = Math.min.apply(null, datasets_context);
              if(max-min<=50){data_decimals=10}
              if(max-min<=10){data_decimals=100}
              if(max-min<=5){data_decimals=1000}
              return Math.round(value*data_decimals)/data_decimals;
            }
          }
        },
      }
      var chart_settings = {
        type: 'bubble',
        data: data_gx,
        options: option_legend
      }
    }

    var chart_canvas = document.getElementById('canvas' + graphic_id).getContext('2d');
    var final_chart = new Chart(chart_canvas, chart_settings);

  } //cierra for data

  // Aplicamos la posición del scroll
  if (scroll > 0) {
    $('.graphics').scrollTop(scroll);
  }
  dragAndDrop.init();
}

function maximize_chart(e){
  var element_to_maximize = e.target.parentElement.parentElement;
  if($(element_to_maximize).hasClass('chart_maxi')){
    $(element_to_maximize).detach().appendTo(original_chart_container);
    $(element_to_maximize).removeClass('chart_maxi');
    $('#sidebar_all').removeClass('d-none');
    $('#map').css('opacity','1');
    $('.table_data_container').removeClass('d-none');
  } else{
    original_chart_container = element_to_maximize.parentNode;
    $(element_to_maximize).detach().appendTo('body');
    $(element_to_maximize).addClass('chart_maxi');
    $('#sidebar_all').addClass('d-none');
    $('#map').css('opacity','0.1');
    $('.table_data_container').addClass('d-none');
  }
}

function hide_chart(id_chart){
  $('#chart_container'+id_chart).addClass('d-none');
}
function hide_data_chart(id_chart){
  $('#show_data_chart'+id_chart).addClass('fa-table');
  $('#show_data_chart'+id_chart).removeClass('fa-chart-bar');
  $('#show_data_chart'+id_chart).attr("title","Mostrar Datos");
  $('#show_data_chart'+id_chart).attr("onclick","show_data_chart("+id_chart+")");
  $('#body_graph_table'+id_chart).empty();
  $('#body'+id_chart).removeClass('d-none');
  $('#body_graph_table'+id_chart).addClass('d-none');
}
function show_data_chart(id_chart){
  $('#show_data_chart'+id_chart).removeClass('fa-table');
  $('#show_data_chart'+id_chart).addClass('fa-chart-bar');
  $('#show_data_chart'+id_chart).attr("title","Mostrar Gráfico");
  $('#show_data_chart'+id_chart).attr("onclick","hide_data_chart("+id_chart+")");
  $('#body'+id_chart).addClass('d-none');
  $('#body_graph_table'+id_chart).removeClass('d-none');
  $('#body_graph_table'+id_chart).empty();
  var find_chart = false
  data_gx_all.forEach(function(chart){
    if(chart.id_graph == id_chart && !find_chart){
      find_chart = true;
      var table_html = "<i class='fas fa-download mr-2 custom_cursor' style='float:right' onclick='export_to_excel(\"graph_table"+id_chart+"\",\"geoworks\",\"indicador.xls\")'></i>"
      table_html += "<table class='table-striped m-auto table-hover' id='graph_table"+id_chart+"'>";
      table_html += '<thead><tr>';
      table_html += "<th></td>";
      chart.data_gx.datasets.forEach(function(set){
            table_html += "<th class='p-2 text-center'>"+set.label+"</td>";
        });
      table_html += '</tr></thead>';

      chart.data_gx.labels.forEach(function(lab,index){
        table_html += "<tr class='p-2 border-bottom border-bottom-primary'>";
        table_html += "<td pr-2>"+lab+"</td>";
        chart.data_gx.datasets.forEach(function(set){
          if(set.data[index]!=null){
            table_html += "<td class='text-center pr-2 pl-2'>"+set.data[index]+"</td>";
          } else {
            table_html += "<td class='text-center'></td>";
          }
        });
        table_html += "</tr>"
      });
      table_html += "</table>";
      $('#body_graph_table'+id_chart).append(table_html);
    }
  })
}



//****** FUNCIONES PARA TABLA DE DATOS*****
// Función para traer todos los datos de los registros contenidos y filtrados
function init_data_dashboard(haschange,close_info,subfield_ids_saved,is_saved) {
  //Evita calcular la tabla si está oculta o si no existe por autorización de roles
  if ($('#status-view').hasClass('status-view-condensed') || $('.table_data_container').length==0) {
    return;
  }
  $('#multiple_edit').addClass('d-none');
  //cierra modal de información del registro
  if(close_info){$("#info-modal").modal("hide");}
  // descliquea checkbox select_all
  $('#table_select_all').prop('checked', false);
  $(".fakeLoader").css("display", "block");
  var type_box = 'polygon';
  var size_box = Navarra.dashboards.config.size_polygon;
  if (size_box.length == 0) {
    var size_box = [];
    type_box = 'extent';
    size_ext = Navarra.dashboards.config.size_box;
    size_box[0] = size_ext['_southWest']['lng'];
    size_box[1] = size_ext['_southWest']['lat'];
    size_box[2] = size_ext['_northEast']['lng'];
    size_box[3] = size_ext['_northEast']['lat'];
  }

  var attribute_filters = Navarra.project_types.config.attribute_filters;
  var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;

  var project_type_id = Navarra.dashboards.config.project_type_id;
  var per_page = $(".select_perpage").html();
  var per_page_value = parseInt(per_page);
  if (!isNaN(per_page_value)) {
    if ($(".active_page").length == 0) {
      var active_page = 1
    } else {
      var active_page = parseInt($(".active_page").html());
    }
    var offset_rows = per_page_value * (active_page - 1);
  }
  var filter_value = $("#choose").val();
  var filter_by_column = $(".filter_by_column").val();
  var order_by_column = $(".order_by_column").val();
  var from_date = Navarra.project_types.config.from_date;
  var to_date = Navarra.project_types.config.to_date;
  var active_layers = get_active_layers();
  var intersect_width_layers = $('#switch_intersect_layers').is(":checked");
  var filters_layers = Navarra.project_types.config.filters_layers;
  var timeslider_layers = Navarra.project_types.config.timeslider_layers;

  if (xhr_table && xhr_table.readyState != 4) {
    xhr_table.abort();
  }
  xhr_table = $.ajax({
    type: 'POST',
    url: '/project_types/search_data_dashboard',
    datatype: 'json',
    data: {
      filter_value: filter_value,
      filter_by_column: filter_by_column,
      order_by_column: order_by_column,
      project_type_id: project_type_id,
      offset_rows: offset_rows,
      per_page_value: per_page_value,
      type_box: type_box,
      size_box: size_box,
      data_conditions: attribute_filters,
      filtered_form_ids: filtered_form_ids,
      from_date: from_date,
      to_date: to_date,
      active_layers: active_layers,
      intersect_width_layers: intersect_width_layers,
      filters_layers: filters_layers,
      timeslider_layers: timeslider_layers
    },

    success: function(data) {
      var fields = document.querySelectorAll(".field_key");
      if(JSON.stringify(data_dashboard) == JSON.stringify(data.data) && !is_saved){
        $(".fakeLoader").css("display", "none");
        // Verifica si tiene que crear tabla de subformularios
        create_subforms_table(subfield_ids_saved);
        // quita el scroll falso de la cabecera si el cuerpo no tiene scroll
        return;
      }
      data_dashboard = data.data

      // borramos los datos anteriores
      $("#tbody_visible").empty();
      $("#total_table").empty();
      Navarra.dashboards.app_ids_table=[];

      // verificamos columnas ocultas
      array_column_hidden = [];
      $('#table_hidden th').not(".header_column_layer").each(function(){
        if($(this).is(':hidden')){
          array_column_hidden.push(false);
        } else{
          array_column_hidden.push(true);
        }
      })

      var found_id = -1;
      var appid_selected = 0;

      //creación de los DOM de la tabla
      array_datos = [];
      data_dashboard.forEach(function(element, index) {
        var data_properties = element.properties;
        var new_row = document.createElement("TR");
        new_row.id="row_table_data"+data_properties["app_id"];
        new_row.style.cursor = "pointer";
        new_row.className = "row_data";
        //agrega el app_id a la variable global
        Navarra.dashboards.app_ids_table.push(data_properties["app_id"]);

        var new_celd="";
        fields.forEach(function(column, indexColumn) {
          new_celd_create = create_celd_table(column,indexColumn, data_properties, per_page_value, active_page ,index,false, element.color, element.name);
          new_celd+=new_celd_create;
        });
        document.getElementById("tbody_visible").appendChild(new_row);
        $('#row_table_data'+data_properties["app_id"]).html(new_celd);
        // termina DOMs de la tabla

        $('#row_table_data'+found_id).addClass('found');
      });
        // comienza llenado de la tabla
          var column_to_fill =  document.querySelectorAll('._columnname');
          column_to_fill.forEach(function(col,index_data){
            col.innerHTML = array_datos[index_data].toString().replace(/[{}[\]"]/g,"");
          });
        // termina llenado de la tabla

      $(".fakeLoader").css("display", "none");

       // Verifica si tiene que crear tabla de subformularios
      create_subforms_table(subfield_ids_saved);
      // Verifica si tiene que crear tabla de capas
      create_layers_table();
    }
  });

  if (Navarra.project_types.config.item_selected != "" && Navarra.project_types.config.data_dashboard.substring(0, 14) != "strToLowerCase") {
    Navarra.geomaps.current_layer();
  }

  //Si hay cambios en los datos, recalcula el search
  if (haschange) {
    if (filter_value != "") { // si hay una búsqueda en el search
      Navarra.project_types.config.data_dashboard = "strToLowerCase(" + filter_by_column + ") like '%" + filter_value.toLowerCase() + "%'";
      Navarra.geomaps.current_layer();

      //calcula paginación de la busqueda e indicador de cantidad sobre el total
      if (xhr_table_search && xhr_table_search.readyState != 4) {
        xhr_table_search.abort();
      }
      xhr_table_search = $.ajax({
        type: 'POST',
        url: '/project_types/search_data_dashboard',
        datatype: 'json',
        data: {
          filter_value: filter_value,
          filter_by_column: filter_by_column,
          order_by_column: order_by_column,
          project_type_id: project_type_id,
          offset_rows: '',
          per_page_value: '',
          type_box: type_box,
          size_box: size_box,
          data_conditions: attribute_filters,
          filtered_form_ids: filtered_form_ids,
          from_date: from_date,
          to_date: to_date,
          active_layers: active_layers,
          intersect_width_layers: intersect_width_layers,
          filters_layers: filters_layers,
          timeslider_layers: timeslider_layers
        },

        success: function(data) {
          var totalfiles_selected = data.data.length;
          // pagina teniendo en cuenta solo lo buscado en el search
          data_pagination(totalfiles_selected, 1);
          //calcula y muestra el indicador del total buscado sobre el total en el mapa
          if ($('.total_files').val() > 0) {
            var percentage_selected = parseInt(totalfiles_selected / $('.total_files').val() * 10000) / 100;
            $('.selected_files_from_total').html(totalfiles_selected + "/" + $('.total_files').val() + " (" + percentage_selected + "%)");
          } else {
            $('.selected_files_from_total').html("");
          }
        }
      });
    } else {
      if (Navarra.project_types.config.data_dashboard.substring(0, 14) == "strToLowerCase") { // si no hay búsqueda pero había algo filtrado desde la tabla previamente
        //borra la selección previa
        Navarra.project_types.config.data_dashboard = "";
        Navarra.geomaps.current_layer();
        // reinicia paginacion
        data_pagination($('.total_files').val(), 1);
        //elimina el indicador de total buscado
        $('.selected_files_from_total').html("");
      }
    }
  }

}

function create_celd_table(column, indexColumn, data_properties, per_page_value, active_page, index,is_new_file, status_color, user_name){
  var column_name = column.value;
  appid_info = data_properties["app_id"];
  appid_selected = data_properties["app_id"];
  if (column.value == "#_action") {
    var new_dom = "<i id='info_icon_table"+appid_info+"' class='fas fa-info-circle' style='margin-right:10px; border-radius: 5px; padding:5px; color:white; background:"+status_color+"' title='Más Información' onclick='show_item_info(" + appid_info + ",false)'></i>"
    array_datos.push(new_dom);
  }
  if (column.value == "#_select") {
    var new_dom = "<div>"+
          "<div class='custom-control custom-checkbox' title='Seleccionar'>"+
          "<input type='checkbox' class='custom-control-input' id='check_select_"+appid_info+"' onchange='changeSelected()'>"+
          "<label class='string optional control-label custom-control-label' for='check_select_"+appid_info+"'></label>"+
          "</div>"+
          "<i class='fas fa-image icons' title='Fotos' onClick='Navarra.photos.open_photos("+appid_info+")'></i>"+
          "</div>"
    array_datos.push(new_dom);
  }
  if (column.value == "#") {
    if (isNaN(per_page_value)) {
        array_datos.push(index+1);
    } else {
        array_datos.push((index + 1) + (active_page - 1) * per_page_value);
    }
    $('.field_key_layer').each(function(key_layer){
      array_datos.push("");
    });
  }
  if (column.value != "#" && column.value != "#_action" && column.value != "#_select") {
    if (data_properties[column_name] != undefined) {
      if (column.value == "app_usuario" && user_name!= undefined) {
        array_datos.push(user_name);
      } else{
        array_datos.push(data_properties[column_name]);
      }
      if (column.value == "app_id") {
        if (Navarra.project_types.config.item_selected == data_properties[column_name]) {
          found_id = data_properties["app_id"];
          Navarra.project_types.config.data_dashboard = "app_id = '" + appid_selected + "'";
        }
      }
    } else{
      array_datos.push("");
    }
  }
  var text_hidden = "";
  if(!array_column_hidden[indexColumn]){
    text_hidden = "d-none";
  }
  if(index==0){
    if(column_name!='#'){
      var field_name = $('#columnfake_'+column_name +' p').html();
    } else {
      var field_name = '#';
    }
      $('#total_table').append("<td name_function='"+field_name+"' class='"+text_hidden+" footer_key footer_key"+column_name+"'></td>");
    }
  if(is_new_file && (data_properties[column_name]!=undefined || column_name=="#_action" || column_name == "#_select")){
    if(column_name=="#"){
      new_celd_create = new_celd_create = "<td class='_columnname custom_row "+text_hidden+"' onclick='show_item("+appid_selected+")'></td>"
    } else{
      if(data_properties[column_name]!=undefined){
        new_celd_create = "<td class='_columnname custom_row celd_id"+appid_selected+" celd_key"+column_name+" "+text_hidden+"' onclick='show_item("+appid_selected+")'>"+data_properties[column_name]+"</td>"
      }
      if(column_name=="#_action" || column_name == "#_select"){
        new_celd_create = "<td class='_columnname action_celd custom_row "+text_hidden+"' onclick='show_item("+appid_selected+")'>"+new_dom+"</td>"
      }
    }
  } else{
    if(column_name=="#"){
      new_celd_create = new_celd_create = "<td class='_columnname custom_row "+text_hidden+"' onclick='show_item("+appid_selected+")'></td>"
      $('.field_key_layer').each(function(index_layer,key_layer){
        new_celd_create += "<td class='_columnname custom_row d-none celdlayer celdlayer_id"+appid_selected+" celdlayer_key"+key_layer.id.substring(9)+"' onclick='show_item("+appid_selected+")'></td>"
        if(index==0){
          var field_name = $('#columnfake_layer_'+key_layer.id.substring(9).split('|')[1]+'_'+key_layer.id.substring(9).split('|')[0] +' p').html();
          $('#total_table').append("<td name_function='"+field_name+"' class='d-none footer_key footerlayer_key"+key_layer.id.substring(9)+"'></td>")
        }
      });
    } else{
      if(column_name=="#_action" || column_name == "#_select"){
        new_celd_create = "<td class='_columnname action_celd custom_row celd_id"+appid_selected+" celd_key"+column_name+" "+text_hidden+"' onclick='show_item("+appid_selected+")'></td>"
      } else{
        new_celd_create = "<td class='_columnname custom_row celd_id"+appid_selected+" celd_key"+column_name+" "+text_hidden+"' onclick='show_item("+appid_selected+")'></td>"
      }
    }
  }

  return new_celd_create;
}

//función para paginar datos
function data_pagination(selected, active_page) {
  var per_page = $('.select_perpage').html();
  var per_page_value = parseInt(per_page);
  if (!isNaN(per_page_value)) {
    var numbers = '';
    if (active_page != 1) {
      numbers += '<li class="page_back" style="cursor:pointer"><a><</a></li>';
    } else {
      numbers += '<li class="page_back invisible"><a><</a></li>';
    }
    var total_page = Math.ceil(selected / per_page_value);
    var page_hide = false;
    var page_hide1 = false;
    for (i = 1; i <= total_page; i++) {
      if (i <= 3 || i > total_page - 1 || i == active_page - 1 || i == active_page || i == active_page + 1) {
        if (i == active_page) {
          numbers += '<li><a class="page_data active_page">' + i + '</a></li>'
        } else {
          numbers += '<li><a class="page_data">' + i + '</a></li>'
        }
      } else {
        if (i < total_page - 1 && !page_hide) {
          numbers += '<h6 class="p-0 m-0">..</h6>';
          page_hide = true;
        }
        if (i == total_page - 1 && !page_hide1) {
          numbers += '<h6 class="p-0 m-0">..</h6>';
          page_hide1 = true;
        }
      }
    }
    if (active_page != total_page) {
      numbers += '<li class="page_foward" style="cursor:pointer"><a>></a></li>';
    } else {
      numbers += '<li class="page_foward invisible"><a>></a></li>';
    }
    $('#page_numbers').replaceWith('<ul class="pagination pagination-sm m-0" id="page_numbers">' + numbers + '</ul>');
  // si la página activa no existe vuelve a la página 1
    if($('.active_page').length==0){
      $('.page_data').last().addClass('active_page');
      init_data_dashboard(false); // cómo la página no existe vuelve a buscar los datos, cancelando el ajax anterior
    }
  } else {
    $('#page_numbers').replaceWith('<ul class="pagination pagination-sm m-0" id="page_numbers"></ul>');
  }

  //Pagina activa
  $(".page_data").click(function() {
    active_page = parseInt($(this).html());
    data_pagination(selected, active_page);
    init_data_dashboard(false);
  });
  $(".page_back").click(function() {
    active_page--;
    data_pagination(selected, active_page);
    init_data_dashboard(false);
  });
  $(".page_foward").click(function() {
    active_page++;
    data_pagination(selected, active_page);
    init_data_dashboard(false);
  });
}

function create_subforms_table(subfield_ids_saved){
  // verifica subcolumnas abiertas
  subheader_open = [];
  var field_subforms_open = $('.subfields_data.d-none');
  var field_ids = [];
  field_subforms_open.each(function(){
    var id = $(this).attr('id').substring(12);
    var subfields = $('.'+id+'subfield.d-none');
    subfields.each(function(){
      subheader_object = {
        id_field: id,
        id_subfield: $(this).attr('id').split('_')[2]
      }
      subheader_open.push(subheader_object);
    });
    field_ids.push(id);
    $('.subfield_column_'+id).remove();
    $('.footer_field_'+id).remove();
    $('.footersubform_key_date'+id).remove();
  });
  if(subfield_ids_saved!=undefined){
    subheader_open = subfield_ids_saved;
  }
  if(field_subforms_open.length>0){
    show_subfield(field_ids)
  }
}

function open_subheaders(id_field){
  subheader_open.forEach(function(subheader){
    if(subheader.id_field ==  id_field){
      $('#'+id_field+'_subfield_'+subheader.id_subfield).click();
    }
  });
}

function open_subheaders_no_data(id_field){
  subheader_open.forEach(function(subheader){
    if(subheader.id_field ==  id_field){
      $('#'+id_field+'_subfield_'+subheader.id_subfield).addClass('d-none');
    }
  });
}

//****** TERMINAN FUNCIONES PARA TABLA DE DATOS*****


//****** FUNCIONES PARA TIMESLIDER*****

// Función para iniciar por primera vez el datetime-picker
function init_time_slider() {
  // arma datetimepicker con formato incial por día y le manda los datos del timeslider
  $("#time_slider_from_forms , #time_slider_to_forms , #time_slider_from_subforms , #time_slider_to_subforms"  ).each(function() {
    $(this).datetimepicker({
      format: "DD/MM/YYYY",
      viewMode: "days",
      locale: moment.locale('en', {
        week: {
          dow: 1,
          doy: 4
        }
      }),
    });
  });
}

//Función que cambia el estilo del datetimepicker según la selección por día,seman,mes o año
function change_step_time_slider(origin) {
  if ($('#time_slider_step_'+origin).val() == 'day') {
    $("#time_slider_from_"+origin+" , #time_slider_to_"+origin).each(function() {
      $(this).val('');
      $(this).off('dp.change');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format: "DD/MM/YYYY",
        viewMode: "days",
      });
    })
  }
  if ($('#time_slider_step_'+origin).val() == 'week') {
    $("#time_slider_from_"+origin+" , #time_slider_to_"+origin).each(function() {
      $(this).val('');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format: "DD/MM/YYYY",
        viewMode: "days",
        calendarWeeks: true,
      });
      $(this).on('dp.change', function(e) {
        value = $(this).val();
        dateObject = changeformatDate(value, 'day');
        number_of_week = getWeekNumber(dateObject)
        $(this).val(number_of_week[0] + '-Sem ' + number_of_week[1]);
      });
    })
  }
  if ($('#time_slider_step_'+origin).val() == 'month') {
    $("#time_slider_from_"+origin+" , #time_slider_to_"+origin).each(function() {
      $(this).val('');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format: "MM/YYYY",
        viewMode: "months",
      });
      $(this).off('dp.change');
    })
  }
  if ($('#time_slider_step_'+origin).val() == 'year') {
    $("#time_slider_from_"+origin+" , #time_slider_to_"+origin).each(function() {
      $(this).val('');
      $(this).off('dp.change');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format: "YYYY",
        viewMode: "years",
      });
    })
  }
}

//Función para aplicar el timeslider como filtro
function set_time_slider_filter() {
  //toma los valores from y to y los asigna a las variables globales
  //Formularios
  var step_date_forms = $('#time_slider_step_forms').val();
  var from_forms = $('#time_slider_from_forms').val();
  var to_forms = $('#time_slider_to_forms').val();

  if(from_forms!=""){
    if (step_date_forms == 'day') {
      from_forms = from_forms.split('/')[2] + '-' + from_forms.split('/')[1] + '-' + from_forms.split('/')[0];
    }
    if (step_date_forms == 'week') {
      var dateofweek = getDateOfISOWeek((from_forms.split('-')[1]).substring(4), from_forms.split('-')[0])
      from_forms = dateofweek.getFullYear() + '-' + (dateofweek.getMonth() + 1) + '-' + dateofweek.getDate();
    }
    if (step_date_forms == 'month') {
      from_forms = from_forms.split('/')[1] + '-' + from_forms.split('/')[0] + '-1';
    }
    if (step_date_forms == 'year') {
      from_forms = from_forms + '-1-1';
    }
    from_forms += ' 00:00';
  }

  if(to_forms!=""){
    if (step_date_forms == 'day') {
      to_forms = to_forms.split('/')[2] + '-' + to_forms.split('/')[1] + '-' + to_forms.split('/')[0];
    }
    if (step_date_forms == 'week') {
      var dateofweek = getDateOfISOWeek((to_forms.split('-')[1]).substring(4), to_forms.split('-')[0]);
      //+6días
      var milisec_day = 86400000;
      var lastdayofweek = new Date(dateToTS(dateofweek) + 6 * milisec_day);
      to_forms = lastdayofweek.getFullYear() + '-' + (lastdayofweek.getMonth() + 1) + '-' + lastdayofweek.getDate();
    }
    if (step_date_forms == 'month') {
      last_day = new Date(to_forms.split('/')[1], to_forms.split('/')[0] , 0);
      last_day = last_day.getDate();
      to_forms = to_forms.split('/')[1] + '-' + to_forms.split('/')[0] + '-' + last_day;
    }
    if (step_date_forms == 'year') {
      to_forms = to_forms + '-12-31';
    }
    to_forms += ' 23:59:59.99';
  }

  //Subformularios
  var step_date_subforms = $('#time_slider_step_subforms').val();
  var from_subforms = $('#time_slider_from_subforms').val();
  var to_subforms = $('#time_slider_to_subforms').val();
  if(from_subforms!=""){
    if (step_date_subforms == 'day') {
      from_subforms = from_subforms.split('/')[2] + '-' + from_subforms.split('/')[1] + '-' + from_subforms.split('/')[0];
    }
    if (step_date_subforms == 'week') {
      var dateofweek = getDateOfISOWeek((from_subforms.split('-')[1]).substring(4), from_subforms.split('-')[0]);
      from_subforms = dateofweek.getFullYear() + '-' + (dateofweek.getMonth() + 1) + '-' + dateofweek.getDate();
    }
    if (step_date_subforms == 'month') {
      from_subforms = from_subforms.split('/')[1] + '-' + from_subforms.split('/')[0] + '-1';
    }
    if (step_date_subforms == 'year') {
      from_subforms = from_subforms + '-1-1';
    }
    from_subforms += ' 00:00';
  }

  if(to_subforms!=""){
    if (step_date_subforms == 'day') {
      to_subforms = to_subforms.split('/')[2] + '-' + to_subforms.split('/')[1] + '-' + to_subforms.split('/')[0];
    }
    if (step_date_subforms == 'week') {
      var dateofweek = getDateOfISOWeek((to_subforms.split('-')[1]).substring(4), to_subforms.split('-')[0]);
      //+6días
      var milisec_day = 86400000;
      var lastdayofweek = new Date(dateToTS(dateofweek) + 6 * milisec_day);
      to_subforms = lastdayofweek.getFullYear() + '-' + (lastdayofweek.getMonth() + 1) + '-' + lastdayofweek.getDate();
    }
    if (step_date_subforms == 'month') {
      last_day = new Date(to_subforms.split('/')[1], to_subforms.split('/')[0] , 0);
      last_day = last_day.getDate();
      to_subforms = to_subforms.split('/')[1] + '-' + to_subforms.split('/')[0] + '-' + last_day;
    }
    if (step_date_subforms == 'year') {
      to_subforms = to_subforms + '-12-31';
    }
    to_subforms += ' 23:59:59.99';
  }

  Navarra.project_types.config.from_date_subforms = from_subforms;
  Navarra.project_types.config.to_date_subforms = to_subforms;
  Navarra.project_types.config.from_date = from_forms;
  Navarra.project_types.config.to_date = to_forms;

  //zoom_extent a datos filtrados
  Navarra.geomaps.get_zoomextent();
  // actualiza datos y mapa init_data y show_kpi los ejecuta solo si elo mapa no se mueve
  Navarra.geomaps.current_layer();
  Navarra.geomaps.wms_filter();
  // Fuerza el rearmado de la tabla
    data_dashboard = "";
    init_data_dashboard(false,false);
  Navarra.geomaps.show_labels(false);
}

//Función para eliminar el timeslider como filtro
function clear_time_slider_filter(refresh_data) {
    Navarra.project_types.config.from_date_subforms = "";
    Navarra.project_types.config.to_date_subforms = "";
    Navarra.project_types.config.from_date = "";
    Navarra.project_types.config.to_date = "";
    $('#time_slider_from_forms').val("");
    $('#time_slider_to_forms').val("");
    $('#time_slider_from_subforms').val("");
    $('#time_slider_to_subforms').val("");
      //zoom_extent a datos filtrados
    Navarra.geomaps.get_zoomextent(true);
    // actualiza datos y mapa init_data y show_kpi los ejecuta solo si elo mapa no se mueve
    Navarra.geomaps.current_layer();
    Navarra.geomaps.wms_filter();
    // Fuerza el rearmado de la tabla
    data_dashboard = "";
    init_data_dashboard(false,false);
    Navarra.geomaps.show_labels(false);
}


// Funciones para manejo de fechas
//Devuelve el valor timestamp tipo numerico desde una fecha dada
function dateToTS(date) {
  return date.valueOf();
}

//funcion para obtener el número de semana a partir de una fecha. Las semanas comienzan los lunes
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  // Return array of year and week number
  return [d.getUTCFullYear(), weekNo];
}

//función para devolver una fecha dada un número de semana y un año
function getDateOfISOWeek(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

//función para obtener una objeto fecha cuando el dato está en el formato dd/mm/yyyy o mm/yyyy
function changeformatDate(d, type) {
  var dateParts = d.split("/");
  if (type == 'day') {
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
  }
  if (type == 'month') {
    var dateObject = new Date(+dateParts[1], dateParts[0] - 1, +'1');
  }
  return dateObject;
}
//********TERMINAN FUNCIONES PARA TIMESLIDER*******



//****** FUNCIONES PARA ARMAR REPORTE*****
// Función para traer todos los datos de los registros contenidos y filtrados
var subtitles_names;
var subtitles_ids;
var array_d_none;

function init_report() {
  //cierra modal de información del registro
  $("#info-modal").modal("hide");
  $(".fakeLoader").css("display", "block");

  subtitles_names = [];
  subtitles_ids = [];
  array_d_none = [true];
  var type_box = 'polygon';
  var size_box = Navarra.dashboards.config.size_polygon;
  if (size_box.length == 0) {
    var size_box = [];
    type_box = 'extent';
    size_ext = Navarra.dashboards.config.size_box;
    size_box[0] = size_ext['_southWest']['lng'];
    size_box[1] = size_ext['_southWest']['lat'];
    size_box[2] = size_ext['_northEast']['lng'];
    size_box[3] = size_ext['_northEast']['lat'];
  }

  var attribute_filters = Navarra.project_types.config.attribute_filters;
  var project_type_id = Navarra.dashboards.config.project_type_id;
  var per_page = $(".select_perpage").html();
  var per_page_value = parseInt(per_page);
  if (!isNaN(per_page_value)) {
    if ($(".active_page").length == 0) {
      var active_page = 1
    } else {
      var active_page = parseInt($(".active_page").html());
    }
    var offset_rows = per_page_value * (active_page - 1);
  }
  var filter_value = $("#choose").val();
  var filter_by_column = $(".filter_by_column").val();
  var order_by_column = $(".order_by_column").val();
  var from_date = Navarra.project_types.config.from_date;
  var to_date = Navarra.project_types.config.to_date;
  var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
  var intersect_width_layers = $('#switch_intersect_layers').is(":checked");
  var filters_layers = Navarra.project_types.config.filters_layers;
  var timeslider_layers = Navarra.project_types.config.timeslider_layers;

  //capas activas
  active_layers = get_active_layers();

  if (xhr_report && xhr_report.readyState != 4) {
    xhr_report.abort();
  }
  xhr_report = $.ajax({
    type: 'GET',
    url: '/project_types/search_report_data',
    datatype: 'json',
    data: {
      filter_value: filter_value,
      filter_by_column: filter_by_column,
      order_by_column: order_by_column,
      project_type_id: project_type_id,
      type_box: type_box,
      size_box: size_box,
      data_conditions: attribute_filters,
      from_date: from_date,
      to_date: to_date,
      active_layers: active_layers,
      filtered_form_ids: filtered_form_ids,
      active_layers: active_layers,
      intersect_width_layers: intersect_width_layers,
      filters_layers: filters_layers,
      timeslider_layers: timeslider_layers
    },
    success: function(data) {

      var data_thead = data.thead;

      //ARMADO DE LA CABECERA DE LA TABLA
      // borramos los datos anteriores
      var fields_all_count = 0;
      var fields_all_count_add = 0;
      document.getElementById("thead_report_visible").remove();
      var new_div = document.createElement("THEAD");
      new_div.id = "thead_report_visible";
      document.getElementById("table_hidden_report").appendChild(new_div);
      document.getElementById("thead_report_hidden").remove();
      var new_div = document.createElement("THEAD");
      new_div.id = "thead_report_hidden";
      new_div.style.visibility = "hidden";
      new_div.style.borderBottom = "solid transparent";
      document.getElementById("table_visible_report").appendChild(new_div);

      //armamos fila de proyectos
      var new_row_projects = document.createElement("TR");
      var new_row = document.createElement("TH");
      new_row.className = "report_row";
      var new_element = document.createElement('P');
      new_element.className = "text-secondary p-0 m-0 d-inline";
      new_element.innerHTML = "PROYECTOS";
      new_element.style.lineHeight = "3vh";
      new_row.appendChild(new_element);
      new_row_projects.appendChild(new_row);

      //armamos fila de subtítulos
      var new_row_subtitles = document.createElement("TR");
      new_row_subtitles.className = 'tr_hidden_report';
      var new_row = document.createElement("TH");
      new_row.className = "report_row";
      var new_element = document.createElement('P');
      new_element.className = "text-secondary p-0 m-0 d-inline";
      new_element.innerHTML = "DATOS";
      new_element.style.lineHeight = "3vh";
      new_row.appendChild(new_element);
      new_row_subtitles.appendChild(new_row);

      //armamos fila de campos
      var new_row_fields = document.createElement("TR");
      new_row_fields.className = 'tr_hidden_report';
      var new_row = document.createElement("TH");
      new_row.className = "report_row";
      var new_element = document.createElement('P');
      new_element.className = "text-secondary p-0 m-0 d-inline columnfake_report_#";
      new_element.innerHTML = "#";
      new_element.style.lineHeight = "3vh";
      new_row.appendChild(new_element);
      var new_element = document.createElement('INPUT');
      new_element.type = "text";
      new_element.className = "d-none field_key_report";
      new_element.value = "#";
      new_row.appendChild(new_element);
      new_row_fields.appendChild(new_row);

      // llenamos fila de proyectos
      data_thead.forEach(function(element) {
        var new_row = document.createElement("TH");
        new_row.className = "report_row report_project_" + element.name_layer;
        var new_element = document.createElement('P');
        new_element.className = "text-secondary p-0 m-0 d-inline";
        new_element.innerHTML = element.name;
        new_element.style.lineHeight = "3vh";
        new_row.appendChild(new_element);
        new_drop = document.createElement('DIV');
        new_drop.className = "dropdown d-inline";
        new_a = document.createElement('A');
        new_a.setAttribute("data-toggle", "dropdown");
        new_a.setAttribute("aria-haspopup", true);
     //   new_a.setAttribute("onclick", "open_drop_down_report(event)");
        new_a.id = "dropdown_project_" + element.name_layer;
        new_a.setAttribute("aria-expanded", false);
        var new_element = document.createElement('I');
        new_element.className = "fas fa-plus icons_report d-none text-secondary";
        new_element.style.cursor = "pointer";
        new_element.title = "Agregar Columna";
        new_a.appendChild(new_element)
        new_drop.appendChild(new_a);
        var new_dropdown = document.createElement('DIV');
        new_dropdown.className = "dropdown-menu custom_drop_down scroll";
        new_dropdown.setAttribute("aria-labelledby", "dropdown_project_" + element.name_layer);
        var data_header_fields = element.fields;
        data_header_fields.forEach(function(field, index) {
          if (field.field_type_id != 7 && field.field_type_id != 11) {
            fields_all_count_add++;
            var new_element = document.createElement('P');
            new_element.className = "dropdown-item text-secondary";
            new_element.setAttribute("onclick", "show_column_report(" + fields_all_count_add + ")");
            new_element.innerHTML = field.name;
            if (field.data_table) {
              new_element.style.display = "none";
            }
            new_dropdown.appendChild(new_element);
          }
        });


        new_drop.appendChild(new_dropdown);
        new_row.appendChild(new_drop);
        new_row_projects.appendChild(new_row);

        //arma variable con subtítulos
        data_header_fields.forEach(function(field, index) {
          if (field.field_type_id == 11 && field.calculated_field != "") {
            subtitles_names.push(field.name);
            subtitles_ids.push(JSON.parse(field.calculated_field));
          }
        });
        //llenamos fila de subtítulos
        var data_header_fields = element.fields;
        var fields_count = 0;
        data_header_fields.forEach(function(field, index) {
          if (field.field_type_id != 7 && field.field_type_id != 11) {
            fields_all_count++;
            var new_row = document.createElement("TH");
            new_row.className = "report_row subtitle_row";
            new_row.style.borderBottom = "none";
            var new_element = document.createElement('P');
            new_element.className = "text-secondary p-0 m-0 d-inline";
            new_element.style.whiteSpace = "nowrap";
            new_element.style.lineHeight = "3vh";
            for (x = 0; x < subtitles_ids.length; x++) {
              if (subtitles_ids[x].indexOf(field.id) >= 0) {
                new_element.innerHTML = subtitles_names[x];
              }
            }
            if (!field.data_table) {
              new_row.style.display = "none";
            }
            new_row.appendChild(new_element);
            new_row_subtitles.appendChild(new_row);

            //armamos fila de campos
            var new_row = document.createElement("TH");
            new_row.className = "report_row field_row columnfake_report_" + element.name_layer + '_' + field.key;
            new_row.style.minWidth = "100px";
            new_row.style.borderTop = "none";
            var new_element2 = document.createElement('INPUT');
            new_element2.type = "text";
            new_element2.className = "d-none field_key_report";
            new_element2.value = element.name_layer + '_' + field.key
            new_row.appendChild(new_element2);
            var new_element = document.createElement('DIV');
            new_element.className = "text-secondary";
            var new_element2 = document.createElement('P');
            new_element2.style.whiteSpace = "nowrap";
            new_element2.style.margin = "0px";
            new_element2.style.display = "inline-block";
            new_element2.style.lineHeight = "3vh";
            new_element2.innerHTML = field.name;
            new_element.appendChild(new_element2);

            var new_element2 = document.createElement('I');
            new_element2.className = "fas fa-times icons_report d-none text-danger";
            new_element2.style.cursor = "pointer";
            new_element2.title = "Eliminar";
            new_element2.setAttribute("onclick", "hide_column_report(" + fields_all_count + ")")
            new_element.appendChild(new_element2);
            if (!field.data_table) {
              new_row.style.display = "none";
              array_d_none.push(false);
            } else {
              fields_count++;
              array_d_none.push(true);
            }
            new_row.appendChild(new_element);
            new_row_fields.appendChild(new_row);
          }
        });

        new_row.colSpan = fields_count;
      });
      document.getElementById("thead_report_visible").appendChild(new_row_projects.cloneNode(true));
      document.getElementById("thead_report_hidden").appendChild(new_row_projects);
      document.getElementById("thead_report_visible").appendChild(new_row_subtitles.cloneNode(true));
      document.getElementById("thead_report_hidden").appendChild(new_row_subtitles);
      document.getElementById("thead_report_visible").appendChild(new_row_fields.cloneNode(true));
      document.getElementById("thead_report_hidden").appendChild(new_row_fields);


      // ARMADO DEL CUERPO DE LA TABLA
      var fields = document.getElementById('thead_report_visible').querySelectorAll(".field_key_report");
      // borramos los datos anteriores
      document.getElementById("tbody_visible_report").remove();
      var new_body = document.createElement("TBODY");
      new_body.style.className = "project_data_div";
      new_body.id = "tbody_visible_report";
      document.getElementById("table_visible_report").appendChild(new_body);

      // llenado de la tabla de datos
      data.tbody.forEach(function(element, index) {
        var new_row = document.createElement("TR");
        new_row.className = "row_data_report text-secondary";
        fields.forEach(function(column, indexColumn) {
          var new_celd = document.createElement("TD");
          if (column.value == "#") {
            new_celd.innerHTML = (index + 1);
            new_celd.style.background = element["status_color"];
          } else {
            if (element[column.value] != undefined) {
              new_celd.innerHTML = element[column.value].replace(/[\[\]\"]/g, "").replace('true', 'SI').replace('false', 'NO');
            }
          }
          new_celd.className = "custom_row";
          if (!array_d_none[indexColumn]) {
            new_celd.style.display = "none";
          }
          new_row.appendChild(new_celd);
        });
        document.getElementById("tbody_visible_report").appendChild(new_row);
      });

      $('#modal-report').modal('show');
      $(".fakeLoader").css("display", "none");
      set_subtitles();
    }
  });
}

//oculta columnas
function hide_column_report(index) {
  unset_subtitles()
  index += 1;
  $('#table_hidden_report tr td:nth-child(' + index + ')').css('display', 'none');
  $('.tr_hidden_report th:nth-child(' + index + ')').css('display', 'none');
  $('#table_visible_report tr td:nth-child(' + index + ')').css('display', 'none');
  $('.tr_hidden_report th:nth-child(' + index + ')').css('display', 'none');

  var project_span = $('.tr_hidden_report th:nth-child(' + index + ') input').val().split('_')[0];
  var project_span_number = parseInt($('.report_project_' + project_span).attr('colspan'));
  if (project_span_number > 1) {
    $('.report_project_' + project_span).attr('colspan', project_span_number - 1);
  } else {
    $('.report_project_' + project_span).addClass("d-none");
  }
  $('.custom_drop_down p:nth-child(' + (index - 1) + ')').css("display", "block");
  set_subtitles();
}

//muestra columnas
function show_column_report(index, ) {
  unset_subtitles()
  index += 1;
  $('#table_hidden_report tr td:nth-child(' + index + ')').css('display', 'table-cell');
  $('.tr_hidden_report th:nth-child(' + index + ')').css('display', 'table-cell');
  $('#table_visible_report tr td:nth-child(' + index + ')').css('display', 'table-cell');
  $('.tr_hidden_report th:nth-child(' + index + ')').css('display', 'table-cell');

  var project_span = $('.tr_hidden_report th:nth-child(' + index + ') input').val().split('_')[0];
  var project_span_number = parseInt($('.report_project_' + project_span).attr('colspan'));
  $('.report_project_' + project_span).attr('colspan', project_span_number + 1);
  $('.custom_drop_down p:nth-child(' + (index - 1) + ')').css("display", "none");
  set_subtitles()
}

//agrupamos subtítulos
function unset_subtitles() {
  $('.subtitle_row').attr('colspan', '1');
  var field_rows = document.querySelectorAll('.field_row');
  var subtitles_rows = document.querySelectorAll('.subtitle_row');
  field_rows.forEach(function(row, index) {
    if (row.style.display == 'none') {} else {
      subtitles_rows[index].style.display = "table-cell";
      subtitles_rows[index].style.borderBottom = "none";
    }
  });
}

function set_subtitles() {
  var text_subtitle = "";
  var colspan_number = 0;
  var colspan_array = [];
  var field_rows = document.querySelectorAll('.field_row');
  var subtitles_rows = document.querySelectorAll('#table_hidden_report .subtitle_row');
  subtitles_rows.forEach(function(row) {
    if (row.firstElementChild.innerHTML != "" && row.style.display != "none") {
      if (row.firstElementChild.innerHTML == text_subtitle) {
        row.style.display = "none";
        colspan_number++;
      } else {
        text_subtitle = row.firstElementChild.innerHTML;
        row.style.borderBottom = "solid 2px rgba(0,0,0,0.6)";
        colspan_array.push(colspan_number);
        colspan_number = 1;
      }
    }
  });
  colspan_array.push(colspan_number);
  var colspan_index = 1;
  subtitles_rows.forEach(function(row) {
    if (row.firstElementChild.innerHTML != "" && row.style.display != "none") {
      row.setAttribute("colspan", colspan_array[colspan_index]);
      colspan_index++;
    }
  });
  var subtitles_rows_hidden = document.querySelectorAll('#table_visible_report .subtitle_row');
  subtitles_rows_hidden.forEach(function(row) {
    if (row.firstElementChild.innerHTML != "" && row.style.display != "none") {
      if (row.firstElementChild.innerHTML == text_subtitle) {
        row.style.display = "none";
      } else {
        text_subtitle = row.firstElementChild.innerHTML;
        row.style.borderBottom = "solid 1px rgba(0,0,0,0.6)";
      }
    }
  });

  var colspan_index = 1;
  subtitles_rows_hidden.forEach(function(row) {
    if (row.firstElementChild.innerHTML != "" && row.style.display != "none") {
      row.setAttribute("colspan", colspan_array[colspan_index]);
      colspan_index++;
    }
  });
}

// exportar reporte a excel
function report_to_excel() {
  var origin_table = document.getElementById('table_visible_report');
  var clone_table = origin_table.cloneNode(true);
  clone_table.id = "clone_table";
  clone_table.style.display = "none";
  document.getElementById('modal-report').appendChild(clone_table);
  document.querySelectorAll('#clone_table .dropdown').forEach(e => e.parentNode.removeChild(e));
  var th_clone = document.querySelectorAll('#clone_table th');
  th_clone.forEach(function(e) {
    e.style.display.border = "solid 4px black"
    if (e.style.display == 'none') {
      e.parentNode.removeChild(e);
    }
  });
  var td_clone = document.querySelectorAll('#clone_table td');
  td_clone.forEach(function(e) {
    if (e.style.display == 'none') {
      e.parentNode.removeChild(e);
    }
  });
  export_to_excel('clone_table', 'geoworks', 'reporte.xls')
}


function export_to_excel(table, name, filename) {
  let uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
    base64 = function(s) {
      return window.btoa(decodeURIComponent(encodeURIComponent(s.replace('–', '-').replace(/[\u00A0-\u2666]/g, function(c) {
        return '&#' + c.charCodeAt(0)
      }))))
    },
    format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      })
    }

  if (!table.nodeType) table = document.getElementById(table)
  var ctx = {
    worksheet: name || 'Worksheet',
    table: table.innerHTML
  }
  var link = document.createElement('a');
  link.download = filename;
  link.href = uri + base64(format(template, ctx));
  link.click();
  document.getElementById('clone_table').remove();
}

//********TERMINAN FUNCIONES PARA ARMAR REPORTE*******


//****** FUNCIONES PARA ARMAR MODAL INFORMACION DE CADA REGISTRO*****

function show_item_info(appid_info, from_map, is_multiple, is_new_file) {
  children_fields_all = new Object;
  if(!is_new_file){
    $('#confirmation_geometry_button').removeClass('confirmation_geometry_button_new');
  } else {
    $('.confirmation_geometry').addClass('d-none');
  }
  if(is_multiple){
    $('#multiple_edit').addClass("multiple_on");
    var total_files_to_edit = $('#table_hidden .custom-control-input:checked').not('#table_select_all').length;
    $('#info_title').html(total_files_to_edit + " registros seleccionados ");
  } else{
      $('#multiple_edit').removeClass("multiple_on");
      if( $('#table_hidden .custom-control-input:checked').length>0){
        // si se llamó a edición simple pero hay multiple registros seleccionados, se limpia la selección
        $('#table_select_all').prop('checked',false);
        $('#multiple_edit').addClass("d-none");
        unselect_item_all();
      }
    $('#info_title').html(" Datos del registro ");
  }
  Navarra.dashboards.config.has_field_errors = false;
  var project_type_id = Navarra.dashboards.config.project_type_id;
  Navarra.project_types.config.id_item_displayed = appid_info;
  if (xhr_info && xhr_info.readyState != 4) {
    xhr_info.abort();
  }
  if(is_new_file || is_multiple){
    var url_get = '/project_fields/show_fields';
    var data = {
      project_type_id: project_type_id,
    }
  } else{
    var from_date_subforms = Navarra.project_types.config.from_date_subforms;
    var to_date_subforms = Navarra.project_types.config.to_date_subforms;
    var url_get = '/project_types/search_father_children_and_photos_data';
    var filter_children = [];
    var filter_user_children = [];
    $('.subform_filter').each(function(){
      if(!isNaN($(this).attr('id').split('|')[0])){
        filter_children.push($(this).attr('id'));
      }else {
        filter_user_children.push($(this).attr('id').split('|')[2])
      }
    });
    var data = {
      project_type_id: project_type_id,
      app_id: appid_info,
      from_date_subforms: from_date_subforms,
      to_date_subforms: to_date_subforms,
      filter_children: filter_children,
      filter_user_children: filter_user_children
    }
  }

  xhr_info = $.ajax({
    type: 'GET',
    url: url_get,
    datatype: 'json',
    data: data,
    success: function(data) {
      $('.div_confirmation').addClass("d-none");
      $('.div_confirmation').removeClass("d-inline");
      $("#info-modal").modal('show');
      $(".fa-eye-slash").css("color", "#9b9b9b");

      if(is_multiple){
        $('#archive_icon').css('color','#d3d800');
        $('#enabled_text').html("Activar/Desactivar Registros?");
      } else{
        if(data.row_enabled){
          $('#archive_icon').css('color','#9b9b9b');
          $('#enabled_text').html("Desactivar Registro?");
        } else{
          $('#archive_icon').css('color','red');
          $('#enabled_text').html("Activar Registro?");
        }
      }

      filechange = false;
      statuschange = false;
      //borra datos anteriores
      arraymultiselect=[];
      arraymultiselectChild=[];
      array_child_edited = [];
      child_elements = [];
      document.getElementById('info_body').remove();
      var new_body = document.createElement('DIV');
      new_body.id = 'info_body';
      document.getElementById('modal_info').appendChild(new_body);

      // estado del registro
      // trae datos de los estados
      var father_status = data.father_status;
      var new_div = document.createElement('DIV');
      new_div.className = "d-flex align-items-center mb-3 field_div";
      new_div.id="status_container_info";
      document.getElementById('info_body').appendChild(new_div);
      $.ajax({
      url:  "/projects/search_statuses.json",
      type: "GET",
      data: { project_type_id: project_type_id },
      success: function(data_status) {
        var new_icon = document.createElement('DIV');
        new_icon.className = "status_info_icon";
        if(!is_multiple && !is_new_file){new_icon.style.background = father_status.status_color;}
        document.getElementById("status_container_info").appendChild(new_icon);
        var new_p = document.createElement('SELECT');
        new_p.style.width="90%";
        new_p.setAttribute("onChange","changeStatus(event)");
        new_p.id = "input_status";
        if(!is_new_file){
          new_p.disabled = true;
          new_p.className = "multiselect_field form-control form-control-sm multiselect_status input_status info_input_disabled";
        } else{
          new_p.className = "multiselect_field form-control form-control-sm multiselect_status input_status info_input";
        }
        var status_options = data_status.data;
        var found_status = false;
        status_options.forEach(function(status) {
          var new_option = document.createElement('OPTION');
          new_option.text=status.name;
          if(status.status_type=="Heredable"){
            new_option.disabled = true;
          }
          new_option.value=status.id+"|"+status.color;
          if(!is_multiple && !is_new_file){
            if(father_status.status_id==status.id){
              found_status=true;
              new_option.selected = true;
            }
          }
          new_p.appendChild(new_option);
        });
        if(!found_status || is_multiple){new_p.selectedIndex = -1;}
        document.getElementById("status_container_info").appendChild(new_p);
        if(is_new_file){
          var status_style = 'info_input';
        }else{
          var status_style = 'info_input_disabled';
        }
          $('.multiselect_status').multiselect({
                maxHeight: 450,
                buttonClass: 'text-left mb-1 form-control form-control-sm input_status '+status_style,
                buttonWidth: '100%',
                nonSelectedText: 'Seleccionar',
                selectedClass: 'selected_multiple_item',
                delimiterText: '\n',
                numberDisplayed: 0,
                allSelectedText: false,
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true,
                filterPlaceholder: 'Buscar',
                includeFilterClearBtn: false,
                includeSelectAllOption: false,
                dropRight: true,
              });
      }
      });
      if(!is_new_file && !is_multiple){
        //fotos del registro
        var verify_count_elements_photos = 0
        var father_photos = data.father_photos;
        father_photos.forEach(function(photo) {
          var new_div = document.createElement('DIV');
          new_div.className = "photo_div_info";
          new_div.style.position = "static";
          var new_photo = document.createElement('IMG');
          new_photo.className = "photo_info";
          new_photo.setAttribute('onClick', "open_photo(event)");
          new_photo.src = "data:image/png;base64," + photo.image;
          new_div.appendChild(new_photo);
          var new_photo = document.createElement('P');
          new_photo.innerHTML = photo.name;
          new_photo.className = "photo_description";
          new_div.appendChild(new_photo);
          document.getElementById('info_body').appendChild(new_div);
          verify_count_elements_photos++;
        });
        if(verify_count_elements_photos!= father_photos.length){
          set_error_message("Error: no se pudieron traer todas las fotos del registro");
        }
      }
      // Si es nuevo puede guardar sin hacer cambios en los campos
      if(is_new_file){changeFile()}

      //campos del registro
      father_fields = data.father_fields;
      subtitles_all = [];
      subtitles_all_child = [];
      var verify_count_elements = 0; // variable para chequear que se dibujan todos los campos sin error
      father_fields.forEach(function(element) {
          if (element.field_type_id != 7) {
           //dibuja campo padre
            var new_row = document.createElement('DIV');
            if (element.hidden) {
              new_row.className = "form-row d-none hidden_field row_field";
            } else {
              new_row.className = "form-row row_field";
            }
            if(element.can_read==false){
                new_row.classList.add('canot_read');
              }
            if(element.value != null){
              var element_value_string = element.value.toString();
            } else {
              var element_value_string = element.value;
            }
            if ((element.value == null && element.field_type_id != 11) || (element_value_string == "" && element.field_type_id != 11) || (element_value_string == " " && element.field_type_id != 11)) {
              new_row.classList.add("d-none");
              new_row.classList.add("empty_field");
            }
            if (subtitles_all.indexOf(element.field_id) >= 0) {
              new_row.classList.add("d-none");
              new_row.classList.add("subtile_hidden" + element.field_id);
            }
            var new_celd = document.createElement('DIV');
            if (element.field_type_id == 11) {
              new_celd.className = "col-md-12 info_subtitle";
            } else {
              new_celd.className = "col-md-5";
            }
            var new_p = document.createElement('H7');
            if (element.field_type_id == 11) {
              new_p.className = "btn btn-primary p-0 pl-1 pr-1 text-left custom_button";
              new_p.setAttribute("onClick", "open_subtitle(" + element.calculated_field + ",'')");
              if (element.calculated_field != "") {
                try{
                  subtitles_all = subtitles_all.concat(JSON.parse(element.calculated_field));
                } catch(e){
                  set_error_message("Error de configuración: subtítulo del campo:"+element.name);
                }

              }
              new_p.innerHTML = element.name;
            } else {
              new_p.innerHTML = element.name + ":";
              new_p.classList.add("field_key_json");
              new_p.id=element.field_id+"|key|"+element.key+"|"+element.field_type_id;
            }
            new_celd.appendChild(new_p);
            new_row.appendChild(new_celd);


            if (element.field_type_id != 11) {
              var new_celd = document.createElement('DIV');
              new_celd.className = "col-md-7 field_div static_datetimepicker";
              if(element.field_type_id == 10){new_celd.classList.add("ok_button")}

              // Adapta el código a los diferentes tipos de campos
              if (element.field_type_id == 1 || element.field_type_id == 12) {
                var new_p = document.createElement('TEXTAREA');
                new_p.className = "form-control form-control-sm info_input_disabled textarea_input";
                if(element.key=="app_usuario"){new_p.classList.add('app_usuario_value')}
                if(!is_multiple){
                  new_p.setAttribute("onChange","calculate_all(false,true)");
                } else{
                  new_p.setAttribute('onChange', 'changeFile()');
                }
              }
              var found_nested = false;
              if (element.field_type_id == 2 || element.field_type_id == 10) {
                var new_p = document.createElement('SELECT');
                if(element.field_type_id == 10){
                  new_p.multiple = true;
                }
                new_p.className = "multiselect_field form-control form-control-sm info_input_disabled";
                var items_field = element.other_possible_values;
                //verifica si tiene anidados
                items_field.forEach(function(item) {
                  if(item.nested_items!=null){
                    found_nested = true;
                  }
                });
                if(found_nested){ new_p.classList.add('nested')}
                values = element.value;
                values_nested = element.value;
                //comienza anidados
                if(found_nested){
                  if(element.value!=null){
                    if(Array.isArray(element.value)){
                      values = element.value[0];
                      values_nested = element.value[1];
                    } else{
                      set_error_message("Error en listados anidados: "+element.name);
                    }

                  }
                  var new_p_nested = document.createElement('SELECT');
                  new_p_nested.className = "mb-1 multiselect_field form-control form-control-sm info_input_disabled";
                  new_p_nested.disabled = true;
                  if(element.required==true){
                    new_p_nested.classList.add('required_field');
                  }
                  //Permite editar readonly si es nuevo registro y no tiene un campo calculado automáticamente, siempre y cuando tenga autorización de edición
                  if((element.read_only==true && !is_new_file) || (element.read_only==true && is_new_file && element.calculated_field!="") || element.can_edit==false){
                    new_p_nested.classList.add('readonly_field');
                  }
                  var id_field_nested = element.field_id+"_nested";
                  new_p_nested.id = "field_id_"+id_field_nested;
                  new_p_nested.setAttribute("onChange","changeFile()")
                  //termina anidados
                }

                var found_option = false;
                items_field.forEach(function(item) {
                  var new_option = document.createElement('OPTION');
                  new_option.text=item.name;
                  new_option.value=item.name;
                  if(!found_nested){
                    if(values!=null){
                      if(Array.isArray(values)){
                        values_array = values;
                        for (v=0;v<values_array.length;v++){
                          if(values_array[v]==item.name){
                            found_option=true;
                            new_option.selected = true;
                          }
                        }
                      } else{
                        set_error_message("Error en listados: "+element.name);
                      }
                    }
                  }
                  new_p.appendChild(new_option);
                  if(!found_option || is_multiple){new_p.selectedIndex = -1;}
                  //Comienza Anidados opciones
                  if(item.nested_items!=null){
                    new_option.setAttribute('data-type',item.name);
                    var items_field_nested = item.nested_items;
                    items_field_nested.forEach(function(item_nested) {
                    var new_option_nested = document.createElement('OPTION');
                    new_option_nested.text=item_nested.name;
                    new_option_nested.value=item_nested.name;
                    if(item.name != values){
                      new_option_nested.className = "d-none";
                    }
                    new_option_nested.setAttribute('data-type',item.name);
                    new_p_nested.appendChild(new_option_nested);
                    });
                    if(!is_multiple){
                      new_p_nested.value=values_nested;
                    } else{
                      new_p_nested.selectedIndex=-1;
                    }
                  }
                  //termina anidados opciones
                });
                if(found_nested ){new_p.value=values;}
                new_p.setAttribute('onChange','calculate_all(false,true)');
                if(found_nested){
                  new_p.setAttribute('onChange', 'set_nested(event,true)');
                }
                if(element.data_script!=""){
                  if(!is_multiple){
                    if(element.value==null){isnull_value=null}else{isnull_value="\""+element.value+"\""}
                    new_p.setAttribute('onChange', 'set_script( '+element.data_script+ ',' +element.field_type_id+ ',' +element.field_id +',' +isnull_value+',' +found_nested+',event ,true )');
                  } else{
                    new_p.setAttribute('onChange', 'changeFile()');
                  }
                }
              }

              if (element.field_type_id == 3) {
                var new_p = document.createElement('INPUT');
                new_p.className = "form-control form-control-sm info_input_disabled date_field";
              }

              if (element.field_type_id == 4) {
                var new_p = document.createElement('SELECT');
                new_p.className = "form-control form-control-sm info_input_disabled";
                var new_option = document.createElement('OPTION');
                new_option.text="SI";
                new_option.value="true";
                new_p.appendChild(new_option);
                var new_option = document.createElement('OPTION');
                new_option.text="NO";
                new_option.value="false";
                new_p.appendChild(new_option);
                new_p.value="";
                new_p.setAttribute('onChange', 'changeFile()');
                if(element.data_script!=""){
                  if(!is_multiple){
                    if(element.value==null){isnull_value=null}else{isnull_value="\""+element.value+"\""}
                    new_p.setAttribute('onChange', 'set_script( '+element.data_script+ ',' +element.field_type_id+ ',' +element.field_id +',' +isnull_value+',' +false +',event ,true)');
                  } else{
                    new_p.setAttribute('onChange', 'changeFile()');
                  }
                 }
              }
              if (element.field_type_id == 5) {
                var new_p = document.createElement('INPUT');
                new_p.type = "number";
                new_p.className = "form-control form-control-sm info_input_disabled";
                if(element.key=="app_usuario"){new_p.classList.add('app_usuario_value')}
                if(!is_multiple){
                  new_p.setAttribute("onChange","calculate_all(false,true)");
                } else{
                  new_p.setAttribute('onChange', 'changeFile()');
                }
              }
              new_p.disabled = true;
              if (element.value != null && element.field_type_id != 10 && element.field_type_id != 2) {
                if(!is_multiple){
                  new_p.value = element.value;
                }
              }
              if(element.required==true && !is_multiple){
                new_p.classList.add('required_field');
              }
              if((element.read_only==true && !is_new_file) || (element.read_only==true && is_new_file && element.calculated_field!="") || element.can_edit==false || (is_multiple && element.calculated_field!="") || (is_multiple && element.data_script!="")){
                new_p.classList.add('readonly_field');
              }

              var id_field = element.field_id;
              new_p.id = "field_id_"+id_field;
              new_celd.appendChild(new_p);
              //agrega selector anidado si existe
              if(found_nested){new_celd.appendChild(new_p_nested)}
              new_row.appendChild(new_celd);
            }
            document.getElementById('info_body').appendChild(new_row);
            if(document.getElementById('field_id_'+id_field)!=null){
            if(document.getElementById('field_id_'+id_field).classList.contains("multiselect_field")){
              if(document.getElementById('field_id_'+id_field).classList.contains("readonly_field")){
                var buttonClass = 'text-left mb-1 form-control form-control-sm info_input_disabled readonly_field';
              } else{
                var buttonClass = 'text-left mb-1 form-control form-control-sm info_input_disabled';
              }
              $('#field_id_'+id_field).multiselect({
                maxHeight: 450,
                buttonClass: buttonClass,
                buttonWidth: '100%',
                nonSelectedText: 'Seleccionar',
                selectedClass: 'selected_multiple_item',
                delimiterText: '\n',
                numberDisplayed: 0,
                allSelectedText: false,
                enableFiltering: true,
                enableCaseInsensitiveFiltering: true,
                filterPlaceholder: 'Buscar',
                includeFilterClearBtn: false,
                includeSelectAllOption: false,
                dropRight: true,
              });
            }
          }
          } //termina campo padre
          else {
          // Dibuja campos hijos
            var new_row = document.createElement('DIV');
            if (element.hidden) {
              new_row.className = "d-none hidden_field";
            }

            if (subtitles_all.indexOf(element.field_id) >= 0) {
              new_row.classList.add("d-none");
              new_row.classList.add("subtile_hidden" + element.field_id);
            }
            var new_celd = document.createElement('DIV');
            new_celd.className = 'div_subforms';
            if(!is_new_file && !is_multiple){
              if (element.field_type_id == 7 && element.value.length == 0) {
                new_celd.classList.add('d-none');
              }
            }
            new_celd.id = "child_container_"+element.key;
            // si tiene autorización para nuevos hijos
            if($('#new_subform_control').val()=="true"){
              var new_p = document.createElement('I');
              new_p.className = "fas fa-plus icon_add d-none add_subforms btn btn-primary custom_button p-1";
              new_p.setAttribute('onclick','open_new_child('+element.field_id+',"'+element.name+'","'+element.key+'",'+is_multiple+')');
              new_celd.appendChild(new_p);
            }
            var new_p = document.createElement('H7');
            new_p.innerHTML = element.name + ":";
            new_p.style.borderBottom = "solid 1px";
            new_p.style.display = "inline-block";
            new_celd.appendChild(new_p);
            new_row.appendChild(new_celd);
            child_elements = element.value;
            verify_count_elements_childs = 0;
            if(!is_new_file && !is_multiple){
              child_elements.forEach(function(element_child) {
                var new_row1 = create_new_row_child_date(element_child);
                new_row.appendChild(new_row1);
                var new_row1 = create_new_row_child(element_child, element.field_id, element.name, is_multiple,false);
                new_row.appendChild(new_row1);
              }); //termina for Each childs
              if(verify_count_elements_childs!= child_elements.length){
                set_error_message("Error: no se pudieron traer todos los subformularios del campo "+element.name);
              }
            }
            document.getElementById('info_body').appendChild(new_row);
          }
        verify_count_elements ++;
      }); // termina for Each de padres

      if(verify_count_elements!= father_fields.length){
        set_error_message("Error: no se pudieron traer todos los campos");
      }

      textarea_adjust_height();
      set_date_style(is_multiple);

      // selectores y multiselectores en hijos
          set_multiselect_style_childs();

      //Muestra el punto en el mapa y elimina el seleccionado en la tabla
      if (from_map) {
        $('table tbody tr').removeClass('found');
        Navarra.project_types.config.data_dashboard = "app_id = '" + appid_info + "'";
        Navarra.project_types.config.item_selected = appid_info;
        Navarra.geomaps.current_layer();
      }
      //Ejecuta Script y calculados de campos padres e hijos
        set_script_all();
        if(!is_new_file){
          calculate_all(true,true);
          calculate_all(true,false);
        }
        //si viene de nuevo registro abre edición
        if($("#confirmation_geometry_button").hasClass('confirmation_geometry_button_new')){
          show_confirmation('edit_confirmation');
        }
    }//end Success
  }); //end ajax
}

function create_new_row_child_date(element_child){
  var new_row1 = document.createElement('DIV');
  new_row1.className = "form-row";
  var new_celd = document.createElement('DIV');
  new_celd.className = "col-md-5 ml-3";
  var new_p = document.createElement('H7');
  new_p.innerHTML = "<span style='font-size:2em;position:absolute;margin-top:-5px;margin-left:-30px'>&#8594</span> Fecha:";
  new_p.style.margin = "0px";
  new_celd.appendChild(new_p);
  new_row1.appendChild(new_celd);
  var new_celd = document.createElement('DIV');
  new_celd.className = "col-md-6";
  var new_p = document.createElement('INPUT');
  new_p.className = "form-control form-control-sm info_input_disabled readonly_field";
  new_p.disabled = true;
  new_p.value = element_child.children_gwm_created_at.split("T")[0] + " " + element_child.children_gwm_created_at.split("T")[1].substring(0, 8);
  new_p.style.padding = "0px 0.5rem";
  new_p.style.height = "auto";
  new_celd.appendChild(new_p);
  new_row1.appendChild(new_celd);
  return new_row1;
}

function create_new_row_child(element_child, element_field_id, element_name, is_multiple, is_new){
  //campos de los hijos
  children_fields = element_child.children_fields;
  if(children_fields_all[element_field_id]==undefined){children_fields_all[element_field_id]=new Object}
  children_fields_all[element_field_id] = children_fields;
  var verify_count_elements_childs_fields = 0;
  var new_row_container = document.createElement('DIV');
  children_fields.forEach(function(element_child_field) {
    if(!is_new || (is_new && element_child_field.read_only==true && element_child_field.calculated_field!='') || (is_new && element_child_field.can_edit==false)){
      var classname_field = "info_input_disabled";
    } else {
      var classname_field = "info_input";
    }
    var new_row1 = document.createElement('DIV');
    if (element_child_field.hidden) {
      new_row1.className = "form-row d-none hidden_field row_field static_datetimepicker" ;
    } else {
      new_row1.className = "form-row row_field static_datetimepicker";
    }
    if(element_child_field.can_read==false){
        new_row1.classList.add('canot_read');
    }
    if(!is_new){
      if(element_child_field.value!=null){
        var element_child_field_string = element_child_field.value.toString();
      } else{
        var element_child_field_string = element_child_field.value;
      }
      if ((element_child_field.value == null && element_child_field.field_type_id != 11) || (element_child_field_string== "" && element_child_field.field_type_id != 11) || (element_child_field_string == " " && element_child_field.field_type_id != 11)) {
        new_row1.classList.add("d-none");
        new_row1.classList.add("empty_field");
      }
    }
    if (subtitles_all_child.indexOf(element_child_field.field_id) >= 0) {
      new_row1.classList.add("d-none");
      new_row1.classList.add("subtile_hidden_child" + element_child_field.field_id);
    }
    var new_celd = document.createElement('DIV');
    if (element_child_field.field_type_id == 11) {
      new_celd.className = "col-md-12";
    } else {
      new_celd.className = "col-md-5 ml-3";
    }

    var new_p = document.createElement('H7');
    if (element_child_field.field_type_id == 11) {
      new_p.className = "btn btn-primary p-0 pl-1 pr-1 text-left custom_button";
      new_p.style.cursor = "pointer";
      new_p.setAttribute("onClick", "open_subtitle(" + element_child_field.calculated_field + ",'_child')");
      if (element_child_field.calculated_field != "") {
        try{
          subtitles_all_child = subtitles_all_child.concat(JSON.parse(element_child_field.calculated_field));
        }catch(e){
          set_error_message("Error de configuración: subtítulo del campo subformulario:"+element_child_field.name);
        }
      }
      new_p.innerHTML = element_child_field.name;
    } else {
      new_p.innerHTML = element_child_field.name + ":";
      new_p.classList.add("field_key_child_json");
      new_p.id=element_field_id+"|child|"+element_child.children_id+"|"+element_child_field.field_type_id+"|"+element_child_field.field_id;
    }
    new_p.style.margin = "0px";
    new_celd.appendChild(new_p);
    new_row1.appendChild(new_celd);

    if (element_child_field.field_type_id != 11) {
      var new_celd = document.createElement('DIV');
      new_celd.className = "col-md-6 field_div";
      if(element_child_field.field_type_id == 10){new_celd.classList.add("ok_button")}

      // Adapta el código a los diferentes tipos de campos
      if (element_child_field.field_type_id == 1) {
        var new_p = document.createElement('TEXTAREA');
        new_p.className = "form-control form-control-sm "+classname_field+" textarea_input is_child_field";
        new_p.style.minHeight = '22px';
        if(!is_multiple){
          new_p.setAttribute("onChange","calculate_all(false,false,"+element_child.children_id+","+element_field_id+")");
        } else{
          new_p.setAttribute('onChange','changeChild('+element_child.children_id+')')
        }
      }
      var found_nested = false;
      if (element_child_field.field_type_id == 2 || element_child_field.field_type_id == 10) {
        var new_p = document.createElement('SELECT');
        if(element_child_field.field_type_id == 10){
          new_p.multiple = true;
        }
        new_p.className = "multiselect_field form-control form-control-sm "+classname_field+" is_child_field";
        var items_field = element_child_field.other_possible_values;
        //verifica si tiene anidados
        items_field.forEach(function(item) {
          if(item.nested_items!=null){
            found_nested = true;
          }
        });
        if(found_nested){ new_p.classList.add('nested')}
        values = element_child_field.value;
        values_nested = element_child_field.value;
        //comienza anidados
        if(found_nested){
          if(element_child_field.value!=null){
            if(Array.isArray(element_child_field.value)){
              values = element_child_field.value[0];
              values_nested = element_child_field.value[1];
            } else{
              set_error_message("Error en subformulario, listados anidados : "+element_child_field.name);
            }
          }
          var new_p_nested = document.createElement('SELECT');
          new_p_nested.className = "mb-1 multiselect_field form-control form-control-sm "+classname_field+" is_child_field";
          if(!is_new || (is_new && element_child_field.read_only==true && element_child_field.calculated_field!='') || (is_new && element_child_field.can_edit==false)){
              new_p_nested.disabled = true;
          };
          if(element_child_field.required==true){
            new_p_nested.classList.add('required_field');
          }
          // agregar condición de readonly para hijos cuando son nuevos
          if((element_child_field.read_only==true && !is_new)|| element_child_field.can_edit==false || (is_new && element_child_field.read_only==true && element_child_field.calculated_field!='') ) {
            new_p_nested.classList.add('readonly_field');
          }
          var id_field = element_child_field.field_id;
          var id_child = element_child.children_id;
          var id_field_nested = element_field_id+"_nested";
          new_p_nested.id = "fieldchildid|"+id_field+"|"+id_child+"_nested";
          new_p_nested.setAttribute('onChange','changeChild('+element_child.children_id+')')
        //termina anidados
        }

        var found_option = false;
        items_field.forEach(function(item) {
          var new_option = document.createElement('OPTION');
          new_option.text=item.name;
          new_option.value=item.name;
          if(!found_nested){
            if(values!=null){
              if(Array.isArray(values)){
                values_array = values;
                for (v=0;v<values_array.length;v++){
                if(values_array[v]==item.name){
                  found_option=true;
                  new_option.selected = true;
                }
                }
              } else{
                set_error_message("Error en subformulario, listados: "+element_child_field.name);
              }
            }
          }
          new_p.appendChild(new_option);
          if(!found_option){new_p.selectedIndex = -1;}
          //Comienza Anidados opciones
          if(item.nested_items!=null){
            new_option.setAttribute('data-type',item.name);
            var items_field_nested = item.nested_items;
            var found_option_nested = false;
            items_field_nested.forEach(function(item_nested) {
            var new_option_nested = document.createElement('OPTION');
            new_option_nested.text=item_nested.name;
            new_option_nested.value=item_nested.name;
            if(item.name != values){
              new_option_nested.className = "d-none";
            }
            new_option_nested.setAttribute('data-type',item.name);
            new_p_nested.appendChild(new_option_nested);
            });
            new_p_nested.value=values_nested;
          }
          //termina anidados opciones
        });
        if(found_nested){new_p.value=values;}
        var id_field = element_child_field.field_id;
        var id_child = element_child.children_id;
        arraymultiselect.push(id_field);
        arraymultiselectChild.push(id_child);

        new_p.setAttribute('onChange','changeChild('+element_child.children_id+',' +found_nested +',event)');

        // Script en hijos
        if(element_child_field.data_script!=""){
          if(!is_multiple){
            if(element_child_field.value==null){isnull_value=null}else{isnull_value="\""+element_child_field.value+"\""}
              var id_child_toScript = element_child_field.field_id+"|"+element_child.children_id;
              new_p.setAttribute('onChange', 'set_script('+element_child_field.data_script+ ',' +element_child_field.field_type_id+ ', "' +id_child_toScript +'",' +isnull_value+',' +found_nested +',event , false, '+element_field_id +')');
          } else{
            new_p.setAttribute('onChange','changeChild('+element_child.children_id+',' +found_nested +',event)');
          }
        }
      //

      }
      if (element_child_field.field_type_id == 3) {
        var new_p = document.createElement('INPUT');
        new_p.className = "form-control form-control-sm "+classname_field+" date_field is_child_field";
        new_p.setAttribute("id_field_father",element_field_id)
      }
      if (element_child_field.field_type_id == 4) {
        var new_p = document.createElement('SELECT');
        new_p.className = "form-control form-control-sm "+classname_field+" is_child_field";
        var new_option = document.createElement('OPTION');
        new_option.text="SI";
        new_option.value="true";
        new_p.appendChild(new_option);
        var new_option = document.createElement('OPTION');
        new_option.text="NO";
        new_option.value="false";
        new_p.appendChild(new_option);
        new_p.value="";

        new_p.setAttribute('onChange','changeChild('+element_child.children_id+')');

        // Script en hijos
        if(element_child_field.data_script!=""){
          if(!is_multiple){
            if(element_child_field.value==null){isnull_value=null}else{isnull_value="\""+element_child_field.value+"\""}
              var id_child_toScript = element_child_field.field_id+"|"+element_child.children_id;
              new_p.setAttribute('onChange', 'set_script('+element_child_field.data_script+ ',' +element_child_field.field_type_id+ ', "' +id_child_toScript +'",' +isnull_value+',' +false +',event , false, '+element_field_id +')');
          } else{
            new_p.setAttribute('onChange','changeChild('+element_child.children_id+')');
          }
        }
      //

      }
      if (element_child_field.field_type_id == 5) {
        var new_p = document.createElement('INPUT');
        new_p.type = "number";
        new_p.className = "form-control form-control-sm "+classname_field+" is_child_field";
        if(!is_multiple){
          new_p.setAttribute("onChange","calculate_all(false,false,"+element_child.children_id+","+element_field_id+")");
        } else{
          new_p.setAttribute('onChange','changeChild('+element_child.children_id+')')
        }
      }
      if(!is_new || (is_new && element_child_field.read_only==true && element_child_field.calculated_field!='') || (is_new && element_child_field.can_edit==false)){
        new_p.disabled = true;
      }
      if (element_child_field.value != null && element_child_field.field_type_id != 10 && element_child_field.field_type_id != 2) {
        new_p.value = element_child_field.value
      }
      if(element_child_field.required==true){
        new_p.classList.add('required_field');
      }
      if((element_child_field.read_only==true && !is_new)|| element_child_field.can_edit==false || (is_new && element_child_field.read_only==true && element_child_field.calculated_field!='') ){
        new_p.classList.add('readonly_field');
      }

      new_p.style.padding = "0px 0.5rem";
      new_p.style.height = "auto";
      var id_field = element_child_field.field_id;
      var id_child = element_child.children_id;
      new_p.id = "fieldchildid|"+id_field+"|"+id_child;
      new_celd.appendChild(new_p);
      if(found_nested){new_celd.appendChild(new_p_nested)}
      new_row1.appendChild(new_celd);
    }
    new_row_container.appendChild(new_row1);
    verify_count_elements_childs_fields++;
  });
  if(verify_count_elements_childs_fields!= children_fields.length){
    set_error_message("Error: no se pudieron traer todos los campos del subformulario "+element_name);
  }

  //fotos del hijo
  var children_photos = element_child.children_photos;
  var verify_count_elements_childs_photos = 0;
  children_photos.forEach(function(photo) {
    var new_div = document.createElement('DIV');
    new_div.className = "photo_div_info";
    new_div.style.position = "static";
    var new_photo = document.createElement('IMG');
    new_photo.className = "photo_info";
    new_photo.setAttribute('onClick', "open_photo(event)");
    new_photo.src = "data:image/png;base64," + photo.image;
    new_div.appendChild(new_photo);
    var new_photo = document.createElement('P');
    new_photo.innerHTML = photo.name;
    new_photo.className = "photo_description";
    new_div.appendChild(new_photo);
    new_row_container.appendChild(new_div);
    verify_count_elements_childs_photos++;
  });
  if(verify_count_elements_childs_photos!= children_photos.length){
    set_error_message("Error: no se pudieron traer todas las fotos del campo "+element_name);
  }
  verify_count_elements_childs++;

  return new_row_container;
}

function set_date_style(is_multiple){
  $('.date_field').datetimepicker({
        format: "DD/MM/YYYY",
        viewMode: "days",
        locale: moment.locale('en', {
          week: {
            dow: 1,
            doy: 4
          }
        }),
      });
      $('.date_field').on('dp.change', function(e){
        if(this.id.substring(0,12)=="fieldchildid"){
          if(!is_multiple){
            var id_field_father = this.getAttribute('id_field_father');
            calculate_all(false,false,this.id.split('|')[2],id_field_father);
          } else{
            changeChild(this.id.split('|')[2]);
          }
        } else{
          if(!is_multiple){
            calculate_all(false,true);
          } else{
            changeFile();
          }
        }
    });
}

function set_multiselect_style_childs(){
  for(x=0;x<arraymultiselect.length;x++){
    if(document.getElementById('fieldchildid|'+arraymultiselect[x]+'|'+arraymultiselectChild[x]).classList.contains("readonly_field")){
      var buttonClass = 'text-left form-control form-control-sm info_input_disabled readonly_field is_child_field';
    } else{
      var buttonClass = 'text-left form-control form-control-sm info_input is_child_field';
    }
    $('#fieldchildid\\|'+arraymultiselect[x]+'\\|'+arraymultiselectChild[x]).multiselect({
      maxHeight: 450,
      buttonClass: buttonClass,
      buttonWidth: '100%',
      nonSelectedText: 'Seleccionar',
      selectedClass: 'selected_multiple_item',
      delimiterText: '\n',
      numberDisplayed: 0,
      allSelectedText: false,
      enableFiltering: true,
      enableCaseInsensitiveFiltering: true,
      filterPlaceholder: 'Buscar',
      includeFilterClearBtn: false,
      includeSelectAllOption: false,
      dropRight: true,
    });
  }
}

function open_new_child(element_field_id, element_name, element_key,is_multiple){
  event.target.style.visibility = "hidden";
  $.ajax({
    type: 'GET',
    url: '/project_subfields/show_subfields',
    datatype: 'json',
    data: {
      project_type_id: Navarra.dashboards.config.project_type_id,
      element_field_id: element_field_id
    },
    success: function(data) {
      child_elements_new = {
        children_fields: data,
        children_id: 0,
        children_photos: []
      }
      var new_row1 = create_new_row_child(child_elements_new, element_field_id,element_name,is_multiple,true);
      document.getElementById('child_container_'+element_key).appendChild(new_row1);
      textarea_adjust_height();
      set_date_style(is_multiple);
      set_multiselect_style_childs();
      calculate_all(false,false,0, element_field_id,true)
    }
  })
}

function open_photo(e) {
  var element = e.target.parentElement;
  if (element.style.position != "fixed") {
    element.classList.add('photo_div_info_extended');
    element.classList.remove('photo_div_info');
    element.style.position = "fixed";
  } else {
    element.classList.remove('photo_div_info_extended');
    element.classList.add('photo_div_info');
    element.style.position = "static";
  }
}

function show_hidden_fields() {
  if ($(".hidden_field").length > 0) {
    $(".hidden_field").removeClass("d-none");
    $(".hidden_field").addClass("hidden_field_show");
    $(".hidden_field").removeClass("hidden_field");
    $(".fa-eye-slash").css("color", "#d3d800");
    textarea_adjust_height();
  } else {
    $(".hidden_field_show").addClass("d-none");
    $(".hidden_field_show").addClass("hidden_field");
    $(".hidden_field_show").removeClass("hidden_field_show");
    $(".fa-eye-slash").css("color", "#9b9b9b");
  }
}

function open_subtitle(fields, ischild) {
  var is_new_file = $('#confirmation_geometry_button').hasClass('confirmation_geometry_button_new');
  if (fields != "") {
    fields.forEach(function(field_id) {
      if ($(".subtile_hidden" + ischild + field_id).length > 0) {
        if(is_new_file){
          $(".subtile_hidden" + ischild + field_id).not('.hidden_field').removeClass("d-none");
        } else{
          $(".subtile_hidden" + ischild + field_id).not('.empty_field').not('.hidden_field').removeClass("d-none");
        }
        $(".subtile_hidden" + ischild + field_id).addClass("subtile_visible" + ischild + field_id);
        $(".subtile_hidden" + ischild + field_id).removeClass("subtile_hidden" + ischild + field_id);
      } else {
        $(".subtile_visible" + ischild + field_id).addClass("d-none");
        $(".subtile_visible" + ischild + field_id).addClass("subtile_hidden" + ischild + field_id);
        $(".subtile_visible" + ischild + field_id).removeClass("subtile_visible" + ischild + field_id);
      }

    })
    textarea_adjust_height();
  }
}

function textarea_adjust_height() {
  //ajustamos el alto
  document.querySelectorAll(".textarea_input").forEach(function(element_tag, index) {
    var height_text = "height:" + element_tag.scrollHeight + "px!important ; min-height: 24px";
    element_tag.setAttribute('style', height_text);
  });
}
//****** TERMINAN FUNCIONES PARA ARMAR MODAL INFORMACION DE CADA REGISTRO*****


//****** FUNCIONES PARA EDICION DE REGISTROS *****

function edit_file(edit_parent, edit_child, edit_status){
  var is_new_file = $('#confirmation_geometry_button').hasClass('confirmation_geometry_button_new');
  textarea_adjust_height()
  //verifica requeridos si no es edición múltiple

  var required_field_number = 0;
  $('#info_messages').html("");
  $('#text_toast').html("");
  $('#info_messages').addClass("d-none");
  $('#info_messages').removeClass("text-danger");
  if(!edit_child){array_child_edited=[]}

  if(!$('#multiple_edit').hasClass('multiple_on')){
    $(".required_field").each(function() {
      $(this).parent().closest('div').css("border-bottom","none");
      if( (edit_parent && !edit_child && this.classList.contains('is_child_field')) ||
        (!edit_parent && edit_child && !this.classList.contains('is_child_field'))){}else{
        if(this.value == null || this.value == ""){
          $(this).parent().closest('div').css("border-bottom","solid 2px #dc3545");
          required_field_number++;
        }
      }
    });
    if(required_field_number>0){
      $('#info_messages').html("Complete los campos requeridos");
      $('#info_messages').addClass("text-danger");
      $('#info_messages').removeClass("d-none");
      return;
    }
  }
  if(is_new_file){
    if($("#input_status").val()==null){
      $('#info_messages').html("Agregue un Estado válido");
      $('#info_messages').addClass("text-danger");
      $('#info_messages').removeClass("d-none");
      return;
    }
  }

  if(!filechange && array_child_edited.length==0 && !statuschange){
    $('#info_messages').html("No hay cambios a guardar");
    $('#info_messages').addClass("text-danger");
    $('#info_messages').removeClass("d-none");
    return;
  }


  $(".fakeLoader").css("display", "block");
  var app_ids = getapp_ids();
  // Arma Json properties padres
  if(filechange){
    var properties_to_save = new Object();
    $('.field_key_json').each(function() {
      var key_field_properties = this.id.split('|')[2];
      var id_field_properties = this.id.split('|')[0];
      var fiel_type_properties = this.id.split('|')[3];
      if($('#field_id_'+id_field_properties).val()!="" && $('#field_id_'+id_field_properties).val()!=null ){
        if(fiel_type_properties==2){
          var array_val = [];
          array_val.push($('#field_id_'+id_field_properties).val());
          if(document.getElementById('field_id_'+id_field_properties).classList.contains('nested')){
              array_val.push($('#field_id_'+id_field_properties+'_nested').val());
            }
          var value_field_properties = array_val;
        }else{
          if( fiel_type_properties == 4){
            var value_field_properties = $('#field_id_'+id_field_properties).val().toLowerCase() == 'true' ? true : false;;
          } else{
            if( fiel_type_properties == 5){
              var value_field_properties = parseFloat($('#field_id_'+id_field_properties).val());
              } else{
              var value_field_properties = $('#field_id_'+id_field_properties).val();
            }
          }
        }
        properties_to_save[key_field_properties] = value_field_properties;
      }
    });
  } else {
    var properties_to_save = null;
  }


  //envio de Json hijos
  var child_edited_all = [];
  if(array_child_edited.length>0){
    // array_child_edited es un array que contiene los id de los hijos modificados. 0 para nuevos hijos
    array_child_edited = array_child_edited.unique();
    for(z=0;z<array_child_edited.length;z++){
      var id_field_father_properties;
      // crea array único de ids de campos padres
      var array_field_id_father_grouped = [];
      $('.field_key_child_json').each(function() {
        var id_child_properties = this.id.split('|')[2];
        var id_field_child_properties = this.id.split('|')[4];
        if(id_child_properties==array_child_edited[z]){
          id_field_father_properties = this.id.split('|')[0];
          if($('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val()!="" && $('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val()!=null ){
            array_field_id_father_grouped.push(id_field_father_properties);
          }
        }
      });
      array_field_id_father_grouped = array_field_id_father_grouped.unique();
      for (zz=0; zz<array_field_id_father_grouped.length; zz++){
        var properties_child_to_save = new Object();
        $('.field_key_child_json').each(function() {
          var id_child_properties = this.id.split('|')[2];
          var fiel_type_properties = this.id.split('|')[3];
          var id_field_child_properties = this.id.split('|')[4];
          id_field_father_properties = this.id.split('|')[0];
          if(id_child_properties==array_child_edited[z] && id_field_father_properties==array_field_id_father_grouped[zz]){
            if($('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val()!="" && $('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val()!=null ){
              if(fiel_type_properties==2){
                var array_val = [];
                array_val.push($('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val());
                if(document.getElementById('fieldchildid|'+id_field_child_properties+'|'+id_child_properties).classList.contains('nested')){
                  array_val.push($('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties+'_nested').val());
                }
                var value_field_properties = array_val;
              }else{
                if( fiel_type_properties == 4){
                var value_field_properties = $('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val().toLowerCase() == 'true' ? true : false;;
                } else{
                  if( fiel_type_properties == 5){
                  var value_field_properties = parseFloat($('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val());
                  } else{
                    var value_field_properties = $('#fieldchildid\\|'+id_field_child_properties+'\\|'+id_child_properties).val();
                  }
                }
              }
              properties_child_to_save[id_field_child_properties] = value_field_properties;
              }
            }
          });
          var child_data = new Object();
          child_data.IdFather = app_ids;
          child_data.field_id = parseInt(array_field_id_father_grouped[zz]);
          child_data.child_id = array_child_edited[z];
          child_data.properties = properties_child_to_save;
          child_edited_all.push(child_data);
      }
    }
  }

  if($("#input_status").val()==null){
    var status_id = null;
  } else{
    var status_id = $("#input_status").val().split('|')[0];
  }
  if(is_new_file){
    var type_ajax = 'POST';
    var url_post = '/projects/create_form';
    var data_array = [];
    var data_to_save_file = {
      project_type_id: Navarra.dashboards.config.project_type_id,
      properties: JSON.stringify(properties_to_save),
      subforms: child_edited_all,
      project_status_id: status_id,
      geom: Navarra.geomaps.get_geometries_to_save()
    }
    data_array.push(data_to_save_file);
    data_to_save = {
      data: data_array
    }

  } else {
    var type_ajax = 'PATCH';
    var url_post = '/projects/update_form';
    var data_to_save = {
      app_ids: app_ids,
      properties: JSON.stringify(properties_to_save),
      subforms: child_edited_all,
      project_status_id: status_id,
    }

  }
  $.ajax({
    type: type_ajax,
    url: url_post,
    datatype: 'JSON',
    data: data_to_save,
    success: function(data) {

      $(".fakeLoader").css("display", "none");
      filechange = false;
      array_child_edited = [];
      $('#table_select_all').prop('checked',false);
      // Muestra mensaje
      $('#alert_message').addClass('show');
      $('#alert_message').removeClass('d-none');
      $("#info-modal").modal("hide");
      $('#text_toast').html(data['status']);
      $('#toast').toast('show');
      Navarra.project_types.config.item_selected="";
      Navarra.project_types.config.data_dashboard = "";

       //Ajustar valor en la tabla si está visible
      if(!$('#status-view').hasClass('status-view-condensed')){
        if(is_new_file){
          var id_new = data['id'][0];
          var new_row = document.createElement("TR");
          new_row.id="row_table_data"+id_new;
          new_row.style.cursor = "pointer";
          new_row.className = "row_data";
          var new_celd="";
          // agrega app_id
          properties_to_save["app_id"] = id_new;
          var fields = document.querySelectorAll(".field_key");
          fields.forEach(function(column, indexColumn) {
            new_celd_create = create_celd_table(column,indexColumn, properties_to_save, null, null ,-1,true, $('.status_info_icon').css( "background-color" ));
            new_celd+=new_celd_create;
          });
          document.getElementById("tbody_visible").prepend(new_row);
          $('#row_table_data'+id_new).html(new_celd);
          Navarra.dashboards.app_ids_table.push(id_new);
          // Ajusta función total, promedio max y min si está activada esa función
          fields.forEach(function(column) {
            if(column.value.substring(0,1) !='#'){
              $('.footer_function_key'+column.value).click();
            }
          });
        } else{
          // modifica color del estado
          app_ids.forEach(function(row_element){
            $('#info_icon_table'+row_element).css("background",$('.status_info_icon').css( "background-color" ));
          });
          // fin color del estado
          if(properties_to_save!=null){// si se modificó el padre
            var fields = document.querySelectorAll(".field_key");
            fields.forEach(function(column, indexColumn) {
              if(properties_to_save[column.value]!=undefined){
                var indexval=indexColumn+1;
                app_ids.forEach(function(row_element){
                  if($('.celd_id'+row_element+'.celd_key'+column.value).html()!=properties_to_save[column.value].toString() ){
                    $('.celd_id'+row_element+'.celd_key'+column.value).html(properties_to_save[column.value].toString());
                    $('.celd_id'+row_element+'.celd_key'+column.value).css("font-weight","bold");
                    $('.celd_id'+row_element+'.celd_key'+column.value).css("font-size","1.5em");
                    // Ajusta función total, promedio max y min si está activada esa función
                    $('.footer_function_key'+column.value).click();
                  }
                });
              }
            });
          }
        }
        // Verifica si tiene que crear tabla de subformularios
        create_subforms_table();
        // Verifica si tiene que crear tabla de capas
        create_layers_table();
      }


      update_all();
    }
  });
}

function change_owner(){
  $(".fakeLoader").css("display", "block");
  var app_ids = getapp_ids();
  var user_id = $("#owner_change_select").val();
  $.ajax({
    type: 'PATCH',
    url: '/projects/change_owner',
    datatype: 'JSON',
    data: {
      app_ids: app_ids,
      user_id: user_id
    },
    success: function(data) {
      $(".fakeLoader").css("display", "none");
      $('#table_select_all').prop('checked',false);
      // Muestra mensaje
      $('#alert_message').addClass('show');
      $('#alert_message').removeClass('d-none');
      $("#info-modal").modal("hide");
      $('#text_toast').html(data['status']);
      $('#toast').toast('show');
      Navarra.project_types.config.item_selected="";
      Navarra.project_types.config.data_dashboard = "";
      //Ajustar valor en la tabla
      var fields = document.querySelectorAll(".field_key");
      fields.forEach(function(column, indexColumn) {
        if(column.value=="app_usuario"){
          var indexval=indexColumn+1;
          app_ids.forEach(function(row_element){
            $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').html(user_id);
            $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').css("font-weight","bold");
            $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').css("font-size","1.5em");
          });
        }
      })
      update_all();
    }
  });
}

function disable_file(){
  $(".fakeLoader").css("display", "block");
  var app_ids = getapp_ids();
  $.ajax({
    type: 'PATCH',
    url: '/projects/disable_form',
    datatype: 'JSON',
    data: {
      app_ids: app_ids
    },
    success: function(data) {
      $(".fakeLoader").css("display", "none");
      $('#table_select_all').prop('checked',false);
      // Muestra Mensaje
      $('#alert_message').addClass('show');
      $('#alert_message').removeClass('d-none');
      $("#info-modal").modal("hide");
      $('#text_toast').html(data['status']);
      $('#toast').toast('show');
      Navarra.project_types.config.item_selected="";
      Navarra.project_types.config.data_dashboard = "";
      //elimina las filas de la tabla
      app_ids.forEach(function(row_element){
        $('#row_table_data'+row_element).remove();
      })
      // limpia las funciones totales, promedio, máximo y mínimo
      $('#total_table td').html("");
      setTimeout(function(){update_all(); }, 3000);
    }
  });
}

function delete_file(){
  $(".fakeLoader").css("display", "block");
  var project_type_id = Navarra.dashboards.config.project_type_id;
  var app_ids = getapp_ids();
  $.ajax({
    type: 'PATCH',
    url: '/projects/destroy_form',
    datatype: 'JSON',
    data: {
      app_ids: app_ids,
      project_type_id: project_type_id
    },
    success: function(data) {
      $(".fakeLoader").css("display", "none");
      $('#table_select_all').prop('checked',false);
      $('#alert_message').addClass('show');
      $('#alert_message').removeClass('d-none');
      $("#info-modal").modal("hide");
      $('#text_toast').html(data['status']);
      $('#toast').toast('show');
      Navarra.project_types.config.item_selected="";
      Navarra.project_types.config.data_dashboard = "";
      //elimina las filas de la tabla
      app_ids.forEach(function(row_element){
        $('#row_table_data'+row_element).remove();
      })
      // limpia las funciones totales, promedio, máximo y mínimo
      $('#total_table td').html("");
      update_all();
    }
  });
}

function getapp_ids(){
  var app_ids = [];
  if($('#multiple_edit').hasClass("multiple_on")){
    $('#table_hidden').find('.custom-control-input:checked').not('#table_select_all').each(function(){
      app_ids.push($(this).attr('id').split('_')[2]);
    });
  } else{
    app_ids.push(Navarra.project_types.config.id_item_displayed);
  }
  return app_ids
}

function update_all(){
  Navarra.geomaps.current_layer();
  Navarra.geomaps.show_kpis();
 // init_data_dashboard(true,false);
  var heatmap_actived = Navarra.project_types.config.heatmap_field;
  if (heatmap_actived != '') {
    Navarra.geomaps.heatmap_data();
  }
  Navarra.geomaps.delete_markers();
}

function set_script(data_script,field_type_id,field_id,value,isnested,event, isparent,id_field_father){
  // Script de campos padres
  if(isparent){
    filechange = true;
  } else {
    array_child_edited.push(parseInt(field_id.split('|')[1]));
  }
  if(data_script!=""){
    Navarra.calculated_and_script_fields.Script(JSON.stringify(data_script),field_type_id, field_id,value, false, isparent);
  }
  if(isnested){
    set_nested(event,isparent)
  }
  if(isparent){
    calculate_all(false,true);
  } else {
    calculate_all(false,false,field_id.split('|')[1],id_field_father);
  }
}

function set_script_all(){
  //Ejecuta Script de campos padres
    father_fields.forEach(function(element) {
      if(element.data_script!=""){
        Navarra.calculated_and_script_fields.Script(element.data_script,element.field_type_id,element.field_id,element.value,false,true);
      }
    });
    //Ejecuta Script de campos hijos
    if(child_elements!==undefined){
      child_elements.forEach(function(element_child){
          children_fields.forEach(function(element) {
            var id_child_toScript = element.field_id+"|"+element_child.children_id;
            if(element.data_script!=""){
              Navarra.calculated_and_script_fields.Script(element.data_script,element.field_type_id,id_child_toScript,element.value,true,false);
            }
          });
        });
    }
}


function calculate_all(first_time, isparent, id_child_calculate , id_field_child_calculate, is_new_child){
  var is_new_file = $('#confirmation_geometry_button').hasClass('confirmation_geometry_button_new');
  if(is_new_file){var type_calculation = "new_file"} else{ var type_calculation = "data_edition"}
  //Ejecuta Calculate de campos padres
  if(isparent){
    if(!first_time){filechange = true;}
      father_fields.forEach(function(element) {
        if(element.calculated_field!="" && element.field_type_id!=11){
          if((element.calculated_field=='{"provincia":""}' || element.calculated_field=='{"municipio":""}') && is_new_file){
            if(Navarra.dashboards.config.type_geometry == "Polygon" || Navarra.dashboards.config.type_geometry == "LineString"){
              var geom = Navarra.geomaps.get_geom_to_calculate();
            } else{
              var geom1 = Navarra.geomaps.get_geometries_to_save();
              var geom = {
                latLng: new L.latLng(geom1[0].latLng.lat,geom1[0].latLng.lng)
              }
            }
          } else{ var geom = null}
          Navarra.calculated_and_script_fields.Calculate(element.calculated_field,element.field_type_id,element.field_id,element.value,type_calculation,null,geom,true);
        }
      });
    } else{
      if(is_new_child!=undefined){
        is_new_file = is_new_child;
        if(is_new_file){var type_calculation = "new_file"} else{ var type_calculation = "data_edition"}
      }
      //Ejecuta Calculate de campos hijos
      if(!first_time){
        array_child_edited.push(parseInt(id_child_calculate));
        //ejecuta calculate para el hijo cambiado
          children_fields_all[id_field_child_calculate].forEach(function(element) {
            var id_child_toScript = element.field_id+"|"+id_child_calculate;
            if(element.calculated_field!="" && element.field_type_id!=11){
              Navarra.calculated_and_script_fields.Calculate(element.calculated_field,element.field_type_id,id_child_toScript,element.value,type_calculation,null,null,false);
            }
          });
      } else{
        //ejecuta calculate para todos los hijos
        if(child_elements!==undefined){
          child_elements.forEach(function(element_child){
            children_fields.forEach(function(element) {
              var id_child_toScript = element.field_id+"|"+element_child.children_id;
              if(element.calculated_field!="" && element.field_type_id!=11){
                Navarra.calculated_and_script_fields.Calculate(element.calculated_field,element.field_type_id,id_child_toScript,element.value,type_calculation,null,null,false);
              }
            });
          });
        }
      }
    }
}

function set_nested(event, isparent){
  filechange = true;
  var id_event = event.target.id;
  var id_event_jquery = event.target.id.replaceAll('|','\\|');
  var id_event_nested = id_event_jquery+"_nested";
  if(document.getElementById(id_event).selectedIndex==-1){
    $("#"+id_event_nested+" option").each(function() {
        $(this).addClass('d-none');
    });
  } else{
    var attribute_nested = document.getElementById(id_event).options[document.getElementById(id_event).selectedIndex].getAttribute('data-type');
    $("#"+id_event_nested).val("");
    $("#"+id_event_nested+" option").each(function() {
      if(this.getAttribute('data-type')==attribute_nested){
        $(this).removeClass('d-none')
      } else{
        $(this).addClass('d-none');
      }
    });
  }
}

function changeChild(id_child_edited,isnested,event){
  array_child_edited.push(parseInt(id_child_edited));
  if(isnested){
    set_nested(event,false)
  }
}

function changeFile(){
  filechange = true;
}

function changeStatus(event){
  statuschange = true;
  var color_status = event.target.value.split("|")[1];
  $(".status_info_icon").css("background",color_status);

}

Array.prototype.unique=function(a){
  return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
});

function set_error_message(message){
  Navarra.dashboards.config.has_field_errors = true;
    $('#info_messages').html(message);
    $('#info_messages').addClass("text-danger");
    $('#info_messages').removeClass("d-none");
    $('#edit_confirmation').addClass("d-none");
    $('#edit_confirmation_child').addClass("d-none");
    $('#edit_confirmation').removeClass("d-inline");
    $('#edit_confirmation_child').removeClass("d-inline");
}

function changeSelected(){
  if(event.target.checked){
    var id_checked = event.target.id.split('_')[2];
    $('#row_table_data'+id_checked).addClass('tr_checked');
  } else{
    $('#row_table_data'+id_checked).removeClass('tr_checked');
  }
  if($('#table_hidden .custom-control-input:checked').not('#table_select_all').length>=2){
    $('#multiple_edit').removeClass('d-none');
  } else{
    $('#multiple_edit').addClass('d-none');
  }
  if($('#table_hidden .custom-control-input:checked').not('#table_select_all').length==0){
    $('#table_select_all').prop('checked',false);
  }
  calculate_functions_table();
}

function calculate_functions_table(){
  // Ajusta función total, promedio max y min si está activada esa función
  var fields = document.querySelectorAll(".field_key");
  fields.forEach(function(column) {
    if(column.value.substring(0,1) !='#'){
      $('.footer_function_key'+column.value).click();
    }
  });
  var fields = document.querySelectorAll(".field_key_layer");
  fields.forEach(function(column) {
    var columnid = column.id.substring(9).replace('|','\\|');
    $('.footer_function_key'+columnid).click();
  });
  var fields = document.querySelectorAll(".dropsub");
  fields.forEach(function(column) {
    var columnid = column.id.split('_subfield_')[1];
    $('.footer_function_key'+columnid).click();
  });
}

//****** TERMINAN FUNCIONES PARA EDICION DE REGISTROS *****

function do_number_points_modal(){
  var modal = document.getElementById('pointsModal');
  var numberInput = document.getElementById('numberInput');

  modal.style.display = 'block';
  number_point_value = numberInput.value;
  modal.style.display = 'none';

  Navarra.geomaps.show_random_points(app_id_popup);
};

function do_project_to_save_multipoints_modal(){
  var modal = document.getElementById('savePointsModal');
  var project_selected = document.getElementById('selected_multipoint_project');

  modal.style.display = 'block';
  project_selected_value = project_selected.value;
  modal.style.display = 'none';

  Navarra.geomaps.save_multipoints(app_id_popup);
};


function get_active_layers(){
  active_layers = [];
  check_layers = document.querySelectorAll('input:checked.leaflet-control-layers-selector');
  for (l = 0; l < check_layers.length; l++) {
    if (check_layers[l].type == 'checkbox') {
      var name_layer_project = $(check_layers[l]).next().html().substring(1).split("-filtrados")[0];
      if (name_layer_project != Navarra.dashboards.config.name_layer && name_layer_project.toLowerCase()!="seleccionados" ){
        active_layers.push(name_layer_project);
      }
    }
  }
  // quita elementos repetidos de las capas
  for (var i = active_layers.length - 1; i >= 0; i--) {
    if (active_layers.indexOf(active_layers[i]) !== i) {
      active_layers.splice(i, 1)
    }
  }
  return active_layers;
}

//****** FUNCIONES PARA EXPORTAR GEOJSON*****

function download_geojson() {
 // $(".fakeLoader").css("display", "block");
  var type_box = 'polygon';
  var size_box = Navarra.dashboards.config.size_polygon;
  if (size_box.length == 0) {
    var size_box = [];
    type_box = 'extent';
    size_ext = Navarra.dashboards.config.size_box;
    size_box[0] = size_ext['_southWest']['lng'];
    size_box[1] = size_ext['_southWest']['lat'];
    size_box[2] = size_ext['_northEast']['lng'];
    size_box[3] = size_ext['_northEast']['lat'];
  }
  var column_visibles = [];
  $('.header_column').not('.d-none').find(':input').each(function(){
    if (isNaN($(this).val())){
      column_visibles.push($(this).val());
    }
  })

  var attribute_filters = Navarra.project_types.config.attribute_filters;
  var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
  var project_type_id = Navarra.dashboards.config.project_type_id;
  var name_project = Navarra.dashboards.config.name_project
  var filter_value = $("#choose").val();
  var filter_by_column = $(".filter_by_column").val();
  var order_by_column = $(".order_by_column").val();
  var from_date = Navarra.project_types.config.from_date;
  var to_date = Navarra.project_types.config.to_date;
  var intersect_width_layers = $('#switch_intersect_layers').is(":checked");
  var active_layers = get_active_layers();
  var timeslider_layers = Navarra.project_types.config.timeslider_layers;
  var filters_layers = Navarra.project_types.config.filters_layers;

  $.ajax({
    type: 'GET',
    url: '/project_types/export_geojson.json',
    datatype: 'JSON',
    data: {
      filter_value: filter_value,
      filter_by_column: filter_by_column,
      order_by_column: order_by_column,
      project_type_id: project_type_id,
      name_project: name_project,
      type_box: type_box,
      size_box: size_box,
      attribute_filters: attribute_filters,
      filtered_form_ids: filtered_form_ids,
      from_date: from_date,
      to_date: to_date,
      fields: column_visibles,
      intersect_width_layers: intersect_width_layers,
      active_layers: active_layers,
      timeslider_layers: timeslider_layers,
      filters_layers: filters_layers,
    },
    success: function(data) {
      var jsonObj = JSON.parse(data);
      var data_pretty = encodeURIComponent(JSON.stringify(jsonObj,null,2));
      $("<a />", {
        "download": Navarra.dashboards.config.name_project+".geojson",
        "href" : "data:application/json," + data_pretty
      }).appendTo("body").click(function() {
        $(this).remove()
      })[0].click()
    }
  });

}
