//peticiones Ajax
var xhr_kpi = null;
var xhr_chart = null;
var xhr_table = null;
var xhr_geojson = null;
var xhr_table_search = null;
var xhr_info = null;
var xhr_report = null;
var data_charts;
var filechange;
var statuschange;

var father_fields;
var array_child_edited;
var data_dashboard=[];

Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function init_kpi(size_box = null) {
  $('#div_pagination').css("visibility","hidden");
  $('.tile_count').empty();
  html = ' <div class="spinner-border" style="margin:10px" role="status">'+
        '<span class="sr-only">Loading...</span>'+
        '</div>';
  $('.tile_count').append(html);
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
  //else{
  // type_box = 'filter';
  //   var project_field = Navarra.project_types.config.project_field;
  //   var filter = Navarra.project_types.config.filter;
  //   var input_value = Navarra.project_types.config.input_value;
  //   data_conditions['project_field'] = project_field;
  //   data_conditions['filter'] = filter;
  //   data_conditions['input_value'] = input_value;

  // }
  var data_id = Navarra.dashboards.config.project_type_id;
  var dashboard_id = Navarra.dashboards.config.dashboard_id;
  var attribute_filters = Navarra.project_types.config.attribute_filters;
  var filtered_form_ids = Navarra.project_types.config.filtered_form_ids;
  var from_date = Navarra.project_types.config.from_date;
  var to_date = Navarra.project_types.config.to_date;

  if (xhr_kpi && xhr_kpi.readyState != 4) {
    xhr_kpi.abort();
  }
  xhr_kpi = $.ajax({
    type: 'GET',
    url: '/project_types/kpi.json',
    datatype: 'json',
    data: {
      data_id: data_id,
      size_box: size_box,
      graph: false,
      type_box: type_box,
      data_conditions: attribute_filters,
      filtered_form_ids: filtered_form_ids,
      from_date: from_date,
      to_date: to_date,
    },
    dashboard_id: dashboard_id,
    success: function(data) {
      $('.tile_count').empty();
      data.forEach(function(element) {
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

        if (element['title'] == '% del Total') {
          data_cont = (Number(count_element)).format(2, 3, '.', ',');
        } else {
          data_cont = (Number(count_element)).format(0, 3, '.', ',');
        }

      // if ($('.kpi_' + element['id']).length) {
        // $('.kpi_' + element['id']).replaceWith('<div class="count kpi_' + element['id'] + '">' + data_cont + '</div>');
        //} else {
          html = ' <div class="tile_stats_count">' +
            '<span class="count_top align-top">' + element['title'] + '</span>' +
            '<div class="count align-middle kpi_' + element['id'] + '"> ' + data_cont + '</div>' +
            '</div>' +
            '</div>'
          $('.tile_count').append(html);

       // }

      }); // Cierra forEach
      $('#div_pagination').css("visibility","visible");
    } // Cierra success
  }); // Cierra ajax
}; // Cierra init_kpi

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

    if (xhr_chart && xhr_chart.readyState != 4) {
      xhr_chart.abort();
    }
    xhr_chart = $.ajax({
      type: 'GET',
      url: '/project_types/kpi.json',
      datatype: 'json',
      data: {
        data_id: data_id,
        size_box: size_box,
        graph: true,
        type_box: type_box,
        dashboard_id: dashboard_id,
        data_conditions: attribute_filters,
        filtered_form_ids: filtered_form_ids,
        from_date: from_date,
        to_date: to_date
      },
      success: function(data) {
        console.log("SUCCESS")
        data_charts = data;
        draw_charts();

      } //cierra function data
    }) //cierra ajax
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
function draw_charts() {
  $(".chart_container").remove();
  var data = data_charts;


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

                // Verifica si el dato es un fecha
                var date_regexp = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
                var string = v['name'];
                var isdate = date_regexp.test(string)

                // Si es fecha le da el formato correcto
                if (isdate == true) {
                  // Agrega los ceros faltantes a los días y meses
                  var no_zero_day_regexp = /^(\d{1})\/(\d{1,2})\/(\d{4})/g;
                  var no_zero_month_regexp = /^(\d{1,2})\/(\d{1})\/(\d{4})/g;

                  var day_zero_fail = no_zero_day_regexp.test(string)
                  var month_zero_fail = no_zero_month_regexp.test(string)

                  if (day_zero_fail == true) {
                    var string = string.split('/')
                    string[0] = '0' + string[0]
                    string = string.join('/')
                  };

                  if (month_zero_fail == true) {
                    var string = string.split('/')
                    string[1] = '0' + string[1]
                    string = string.join('/')
                  };

                  // Invierte el orden de la fecha y lo separa con guiones
                  var stringdate = string.split('/').reverse().join('-');

                  // Armamos los arrays de label y count
                  lab.push(stringdate);
                  da.push(v['count']);

                  // Unimos el label con el count
                  var row_array = [];
                  for (var i = 0; i < lab.length; i++) {
                    var row = lab[i] + '|' + da[i]
                    row_array.push(row)
                  }

                  // Ordenamos las fechas (label unido a count)
                  row_array.sort();

                  var labb = [];
                  var daa = [];

                  // Separamos el label del count y armamos los arrays nuevamente
                  for (var i = 0; i < row_array.length; i++) {
                    var abierto = row_array[i].split("|")
                    labb.push(abierto[0]);
                    daa.push(abierto[1]);
                  }

                  da = daa;
                  lab = labb;
                  lab_acumulado = lab;

                } else {

                  // Elimina los corchetes del name
                  lab_final = v['name']
                  if (lab_final != null) {
                    lab_final = lab_final.replace(/[\[\]\"]/g, "")
                  }
                  lab.push(lab_final);
                  lab_acumulado.push(lab_final);
                  da.push(v['count']);
                }
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
            da_all[l].splice(a, 0, 0); //y agrega valor 0 para el eje y
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
          tick_max_left = value['tick_x_max'];
          tick_min_right = value['tick_y_min'];
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

        } //cierra if data
      }) //cierra each b
    }) //cierra each reg


    $('.graphics').append(
      $('<div>', {
        'class': 'card text-light p-0 mt-1 chart-bg-none chart_container',
        'id': 'chart_container' + graphic_id
      }).append(
        $('<div>', {
          'class': 'py-1 px-2',
          'id': 'header' + graphic_id
        }).append(
          // $('<span>', { // handle
          //   'class': 'fas fa-arrows-alt handle border border-dark'
          // }),
          $('<text>', {
            'text': title
          }),
          /* Oculta minimizado hasta solucionar el tema de row
          $('<button>', { // boton minimizar
            'class': 'close',
            'type': 'button',
            'data-toggle': 'collapse',
            'data-target': '#collapse_' + graphic_id,
            'aria-expanded': "true",
            'aria-controls': 'collapse_' + graphic_id,
          }).append(
            $('<i>', { // icono minimizar
              'class': 'fas fa-window-minimize'
            })
          )
          */
        ),
        $('<div>', { // collapse
          'class': 'collapse show',
          'id': 'collapse_' + graphic_id
        }).append(
          $('<div>', {
            'class': 'card-body px-1 pb-0 chart_body_custom',
            'id': 'body' + graphic_id
          }).append(
            $('<canvas>', {
              'class': 'canvas' + graphic_id,
              'id': 'canvas' + graphic_id
            })
          )
        )
      )
    )

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
              stepSize: parseInt(tick_step_left),
              callback: function(label, index, labels) {
                label = label.toLocaleString('es-ES')
                return label;
              },
              fontColor: '#FDFEFE'
            },
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
              stepSize: parseInt(tick_step_left),
              callback: function(label, index, labels) {
                label = label.toLocaleString('es-ES')
                return label;
              },
              fontColor: '#FDFEFE',
            },
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
            formatter: Math.round
          }
        },
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
              stepSize: parseInt(tick_step_left),
              callback: function(label, index, labels) {
                label = label.toLocaleString('es-ES')
                return label;
              },
              fontColor: '#FDFEFE'
            },
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
            formatter: Math.round
          }
        },
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
            formatter: Math.round
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

//****** FUNCIONES PARA TABLA DE DATOS*****
// Función para traer todos los datos de los registros contenidos y filtrados
function init_data_dashboard(haschange,close_info) {
  //Evita calcular la tabla si está oculta o si no existe por autorización de roles
  if ($('#status-view').hasClass('status-view-condensed') || $('.table_data_container').length==0) {
    return;
  }
  $('#multiple_edit').addClass('d-none');
  //cierra modal de información del registro
  if(close_info){$("#info-modal").modal("hide");}
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

  if (xhr_table && xhr_table.readyState != 4) {
    xhr_table.abort();
  }
  xhr_table = $.ajax({
    type: 'GET',
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
      to_date: to_date
    },

    success: function(data) {
      console.log("SUCCESS !!!!!!!!!!!")
      var fields = document.querySelectorAll(".field_key");
      if(JSON.stringify(data_dashboard) == JSON.stringify(data.data)){
        $(".fakeLoader").css("display", "none");
        return;
      }
      data_dashboard = data.data

      // borramos los datos anteriores
      $("#tbody_visible").empty();
      $(".width_only").html("");

      // verificamos columnas ocultas
      var array_column_hidden = [];
      $('#table_hidden th').each(function(){
        if($(this).is(':hidden')){
          array_column_hidden.push(false);
        } else{
          array_column_hidden.push(true);
        }
      })

      var found_id = -1;
      var appid_selected = 0;

      //creación de los DOM de la tabla
      var array_datos = [];
      data_dashboard.forEach(function(element, index) {
        var data_properties = element.properties;
        var new_row = document.createElement("TR");
        new_row.id="row_table_data"+data_properties["app_id"];
        new_row.style.cursor = "pointer";
        new_row.className = "row_data";
        
        var new_celd="";
        fields.forEach(function(column, indexColumn) {
          var column_name = column.value;
          appid_info = data_properties["app_id"];
          appid_selected = data_properties["app_id"];
          if (column.value == "#_action") {
            var new_dom = "<i class='fas fa-info-circle' style='margin-right:10px' title='Más Información' onclick='show_item_info(" + appid_info + ",false)'></i>"
            array_datos.push(new_dom);
          }
          if (column.value == "#_select") {
            var new_dom = "<div class='custom-control custom-checkbox' title='Seleccionar'>"+
                  "<input type='checkbox' class='custom-control-input' id='check_select_"+appid_info+"' onchange='changeSelected()'>"+
                  "<label class='string optional control-label custom-control-label' for='check_select_"+appid_info+"'></label>"+
                  "</div>"
            array_datos.push(new_dom);
          }
          if (column.value == "#") {
            if (isNaN(per_page_value)) {
               array_datos.push(index+1);
              document.getElementById('columnfake_datacount').innerHTML=(index + 1);
            } else {
               array_datos.push((index + 1) + (active_page - 1) * per_page_value);
              document.getElementById('columnfake_datacount').innerHTML=(index + 1) + (active_page - 1) * per_page_value;
            }
          }
          if (column.value != "#" && column.value != "#_action" && column.value != "#_select") {
            if (data_properties[column_name] != undefined) {
              array_datos.push(data_properties[column_name]);
              //agraga el máximo valor a la tabla cabecera para tener 2 tablas con el mismo ancho de columnas
              var celd_width = document.getElementById('columnfake_data_'+column_name);
              if(celd_width.innerHTML=="" || celd_width.innerHTML.length< data_properties[column_name].length){
                celd_width.innerHTML = data_properties[column_name];
              }
              // termina ajuste de ancho
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
            text_hidden = "style = 'display:none'";
          }
          new_celd += "<td class='_columnname custom_row' "+text_hidden+" onclick='show_item("+appid_selected+")'></td>"
          
        });
        document.getElementById("tbody_visible").appendChild(new_row);
        $('#row_table_data'+data_properties["app_id"]).html(new_celd);
        // termina DOMs de la tabla

        $('#row_table_data'+found_id).addClass('found');
      });

        // comienza llenado de la tabla
              $("._columnname").each(function(index_data){
                $(this).html(array_datos[index_data]);
              });
        // termina llenado de la tabla

      $(".fakeLoader").css("display", "none");
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
        type: 'GET',
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
          to_date: to_date
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
//****** TERMINAN FUNCIONES PARA TABLA DE DATOS*****


//****** FUNCIONES PARA TIMESLIDER*****

// Función para iniciar por primera vez el timeslider
function init_time_slider() {
  var milisec_day = 86400000;
  var today = new Date();
  var today_string = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  var today_format = changeformatDate(today_string, "day");
  var min_date = dateToTS(today_format) - 5 * milisec_day;
  var max_date = dateToTS(today_format) + 5 * milisec_day;
  var from_date = dateToTS(today_format) - 2 * milisec_day;
  var to_date = dateToTS(today_format) + 2 * milisec_day;
  var step_time_slider = milisec_day;
  create_time_slider(min_date, max_date, from_date, to_date, step_time_slider);
  // arma datetimepicker con formato incial por día y le manda los datos del timeslider
  $('#time_slider_from').datetimepicker({
    format: "DD/MM/YYYY",
    viewMode: "days",
    locale: moment.locale('en', {
      week: {
        dow: 1,
        doy: 4
      }
    }),
  });
  $('#time_slider_to').datetimepicker({
    format: "DD/MM/YYYY",
    viewMode: "days",
    locale: moment.locale('en', {
      week: {
        dow: 1,
        doy: 4
      }
    }),
  });
  $('#time_slider_from').val(tsToDate(min_date));
  $('#time_slider_to').val(tsToDate(max_date));
}

//Función para crear el time-slider al inciar y al cambiar la configuración
function create_time_slider(min_date, max_date, from_date, to_date, step_time_slider) {
  $('#filter-time-body').prepend(
    $('<div>', {
      'id': 'time_slider_item',
      'style': 'margin-top:10px',
    }).append(
      $("<input>", {
        'id': 'time_slider'
      }),
      $("<div>", {
        'class': 'dropdown-divider',
      })
    )
  )
  $('#filter-time-body').prepend(
    $("<i>", {
      'id': 'time_slider_item-save',
      'class': 'fas fa-calendar-check float-right',
      'style': 'font-size: 1.5em ; margin-top: -16px; margin-right:4px; color: rgba(250,250,250,0.8); cursor:pointer',
      'onclick': 'set_time_slider_filter()',
    })
  )
  $('#filter-time-body').prepend(
    $("<i>", {
      'id': 'time_slider_item-clear',
      'class': 'fas fa-calendar-times float-right',
      'style': 'font-size: 1.5em; margin-top: -16px; margin-right:-16px; color: rgba(250,250,250,0.8); cursor:pointer',
      'onclick': 'clear_time_slider_filter(true)',
    })
  )
  $("#time_slider").ionRangeSlider({
    skin: "flat",
    type: "double",
    step: step_time_slider,
    grid: true,
    grid_snap: true,
    min: min_date,
    max: max_date,
    from: from_date,
    to: to_date,
    prettify: tsToDate,
    onChange: function(data) {
      set_time_slider_color();
    },
    onFinish: function(data) {
      set_time_slider_values(data);
    },
    onStart: function(data) {
      set_time_slider_values(data);
    },
  });

  $('.irs-min , .irs-max  ').css("cursor", "pointer");
  $('.irs-min , .irs-max  ').attr("data-toggle", "modal");
  $('.irs-min , .irs-max  ').attr("data-target", "#time-slider-modal");
  set_time_slider_color();
}

//Función que cambia el estilo del datetimepicker según la selección por día,seman,mes o año
function change_step_time_slider() {
  if ($('#time_slider_step').val() == 'day') {
    $("#time_slider_from , #time_slider_to").each(function() {
      $(this).val('');
      $(this).off('dp.change');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format: "DD/MM/YYYY",
        viewMode: "days",
      });
    })
  }
  if ($('#time_slider_step').val() == 'week') {
    $("#time_slider_from , #time_slider_to").each(function() {
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
  if ($('#time_slider_step').val() == 'month') {
    $("#time_slider_from , #time_slider_to").each(function() {
      $(this).val('');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format: "MM/YYYY",
        viewMode: "months",
      });
      $(this).off('dp.change');
    })
  }
  if ($('#time_slider_step').val() == 'year') {
    $("#time_slider_from , #time_slider_to").each(function() {
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

// Función que manda los valores del modal datetimepicker al timeslider
function set_time_slider() {
  if ($("#time_slider_from").val() == '' || $("#time_slider_to").val() == '') {
    return
  }
  var step_date = $('#time_slider_step').val();
  if (step_date == 'day' || step_date == 'month') {
    var min_date = dateToTS(new Date(changeformatDate($('#time_slider_from').val(), step_date)));
    var max_date = dateToTS(new Date(changeformatDate($('#time_slider_to').val(), step_date)));
  }
  if (step_date == 'week') {
    min_date = dateToTS(getDateOfISOWeek(($('#time_slider_from').val().split('-')[1]).substring(4), $('#time_slider_from').val().split('-')[0]));
    max_date = dateToTS(getDateOfISOWeek(($('#time_slider_to').val().split('-')[1]).substring(4), $('#time_slider_to').val().split('-')[0]));
  }

  if (step_date == 'day' || step_date == 'month' || step_date == 'week') {
    var milisec_day = 86400000;
    if (step_date == 'day') {
      range = 1;
      var step_time_slider = milisec_day;
    }
    if (step_date == 'week') {
      range = 7;
      var step_time_slider = milisec_day * 7;
    }
    if (step_date == 'month') {
      range = 31;
      var step_time_slider = milisec_day * 31;
    }
    var total_range = (dateToTS(max_date) - dateToTS(min_date)) / (milisec_day * range);
    var from_date = dateToTS(min_date) + range * milisec_day;
    var to_date = dateToTS(min_date) + Math.floor(total_range) * 31 * milisec_day;
  }

  if (step_date == 'year') {
    min_date = $('#time_slider_from').val();
    max_date = $('#time_slider_to').val();
    from_date = parseInt(min_date) + 1;
    to_date = parseInt(max_date) - 1;
    var step_time_slider = 1;
  }
  if (max_date <= min_date) {
    return
  }
  $('#time_slider_item').remove();
  $('#time_slider_item-save').remove();
  $('#time_slider_item-clear').remove();
  $('#time-slider-modal').modal('toggle');
  clear_time_slider_filter(false);
  create_time_slider(min_date, max_date, dateToTS(from_date), dateToTS(to_date), step_time_slider);
}

// función que toma el dato y lo convierte en formato "prety" para colocarlo en las etiquetas del timeslider
function tsToDate(ts) {
  var step_date = $('#time_slider_step').val();
  if (step_date == 'day' || step_date == 'month' || step_date == 'week') {
    var lang = "es-AR";
    var d = new Date(ts);
    var d_year = d.getFullYear();
    var d_month = d.getMonth() + 1;
    var d_day = d.getDate();
    if (step_date == 'day') {
      var d_format = d_day + '/' + d_month + '/' + d_year;
    }
    if (step_date == 'month') {
      var month_names = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
      var d_format = month_names[d_month - 1] + '/' + d_year;
    }
    if (step_date == 'week') {
      number_of_week = getWeekNumber(d);
      var d_format = number_of_week[0] + '-Sem ' + number_of_week[1];
    }
  } else {
    d_format = ts
  }
  return d_format;
}

// Función para colocar el timeslider en gris (no aplicado)
function set_time_slider_color() {
  var colored_element = ['.irs-bar', '.irs-from', '.irs-to', '.irs-single', '.irs-handle>i:first-child'];
  colored_element.forEach(function(element) {
    $(element).addClass('time-slider-inactive');
    $(element).removeClass('time-slider-active');
  })
}

//Función para tomar los datos del from y del to y convertirlos en fechas
function set_time_slider_values(data) {
  var from_pretty = data.from_pretty;
  var to_pretty = data.to_pretty;
  var step_date = $('#time_slider_step').val();
  if (step_date == 'day') {
    from_pretty = from_pretty.split('/')[2] + '-' + from_pretty.split('/')[1] + '-' + from_pretty.split('/')[0];
    to_pretty = to_pretty.split('/')[2] + '-' + to_pretty.split('/')[1] + '-' + to_pretty.split('/')[0];
  }
  if (step_date == 'week') {
    var dateofweek = getDateOfISOWeek((from_pretty.split('-')[1]).substring(4), from_pretty.split('-')[0])
    from_pretty = dateofweek.getFullYear() + '-' + (dateofweek.getMonth() + 1) + '-' + dateofweek.getDate();
    var dateofweek = getDateOfISOWeek((to_pretty.split('-')[1]).substring(4), to_pretty.split('-')[0])
    //+6días
    var milisec_day = 86400000;
    var lastdayofweek = new Date(dateToTS(dateofweek) + 6 * milisec_day);
    to_pretty = lastdayofweek.getFullYear() + '-' + (lastdayofweek.getMonth() + 1) + '-' + lastdayofweek.getDate();
  }
  if (step_date == 'month') {
    var month_names = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
    from_pretty = from_pretty.split('/')[1] + '-' + (jQuery.inArray(from_pretty.split('/')[0], month_names) + 1) + '-1';
    last_day = new Date(to_pretty.split('/')[1], (jQuery.inArray(to_pretty.split('/')[0], month_names) + 1), 0);
    last_day = last_day.getDate();
    to_pretty = to_pretty.split('/')[1] + '-' + (jQuery.inArray(to_pretty.split('/')[0], month_names) + 1) + '-' + last_day;
  }
  if (step_date == 'year') {
    from_pretty = from_pretty + '-1-1';
    to_pretty = to_pretty + '-12-31';
  }
  from_pretty += ' 00:00';
  to_pretty += ' 23:59:59.99';
  $('#time-slider-from-value').val(from_pretty);
  $('#time-slider-to-value').val(to_pretty);
}

//Función para aplicar el timeslider como filtro
function set_time_slider_filter() {
  var colored_element = ['.irs-bar', '.irs-from', '.irs-to', '.irs-single', '.irs-handle>i:first-child'];
  colored_element.forEach(function(element) {
    $(element).addClass('time-slider-active');
    $(element).removeClass('time-slider-inactive');
  });
  if ($('#prev_bar') != undefined)($('#prev_bar').remove());
  var width_clone = (100 * parseFloat($('.irs-bar').css('width')) / parseFloat($('.irs-bar').parent().css('width'))) + '%';
  var left_clone = (100 * parseFloat($('.irs-bar').css('left')) / parseFloat($('.irs-bar').parent().css('width'))) + '%';
  var prev_bar = $('.irs-bar').clone();
  prev_bar.attr('id', 'prev_bar');
  prev_bar.appendTo('.irs--flat');
  var styletext = 'background:#d3d800!important;left:' + left_clone + ';width:' + width_clone;
  $('#prev_bar').attr('style', styletext);

  //toma los valores from y to y los asigna a las variables globales
  Navarra.project_types.config.from_date = $('#time-slider-from-value').val();
  Navarra.project_types.config.to_date = $('#time-slider-to-value').val();

  //zoom_extent a datos filtrados
  Navarra.geomaps.get_zoomextent();
  // actualiza datos y mapa init_data y show_kpi los ejecuta solo si elo mapa no se mueve
 // init_data_dashboard(true);
  Navarra.geomaps.current_layer();
 // Navarra.geomaps.show_kpis();
 show_labels(false);
}

//Función para eliminar el timeslider como filtro
function clear_time_slider_filter(refresh_data) {
  Navarra.project_types.config.from_date = "";
  Navarra.project_types.config.to_date = "";
  if ($('#prev_bar') != undefined)($('#prev_bar').remove());
  set_time_slider_color();
  if (refresh_data) {
      //zoom_extent a datos filtrados
    Navarra.geomaps.get_zoomextent(true);
    // actualiza datos y mapa init_data y show_kpi los ejecuta solo si elo mapa no se mueve
  //  init_data_dashboard(true);
    Navarra.geomaps.current_layer();
    //Navarra.geomaps.show_kpis();
  }
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

  //capas activas
  active_layers = [];
  check_layers = document.querySelectorAll('input:checked.leaflet-control-layers-selector');
  for (l = 0; l < check_layers.length; l++) {
    if (check_layers[l].type == 'checkbox') {
      var name_layer_project = $(check_layers[l]).next().html().substring(1).split("-filtrados")[0];
      active_layers.push(name_layer_project);
    }
  }
  // quita elementos repetidos de las capas
  for (var i = active_layers.length - 1; i >= 0; i--) {
    if (active_layers.indexOf(active_layers[i]) !== i) {
      active_layers.splice(i, 1)
    }
  }
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
      active_layers: active_layers
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
      document.getElementById("tbody_hidden_report").remove();
      var new_body = document.createElement("TBODY");
      new_body.style.visibility = "hidden";
      new_body.id = "tbody_hidden_report";
      document.getElementById("table_hidden_report").appendChild(new_body);
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
        document.getElementById("tbody_visible_report").appendChild(new_row.cloneNode(true));
        document.getElementById("tbody_hidden_report").appendChild(new_row);
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

// exportar tabla a excel
function table_to_excel() {
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

function show_item_info(appid_info, from_map, is_multiple) {
  if(is_multiple){
    $('#multiple_edit').addClass("multiple_on");
    var total_files_to_edit = $('#table_visible .custom-control-input:checked').not('.just_header').length;
    $('#info_title').html(total_files_to_edit + " registros seleccionados ");
  } else{
      $('#multiple_edit').removeClass("multiple_on");
      if( $('#table_visible .custom-control-input:checked').length>0){
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
  xhr_info = $.ajax({
    type: 'GET',
    url: '/project_types/search_father_children_and_photos_data',
    datatype: 'json',
    data: {
      project_type_id: project_type_id,
      app_id: appid_info
    },
    success: function(data) {
      console.log('Padres e hijos sin actualizar');
      console.log(data);

      $('.div_confirmation').addClass("d-none");
      $('.div_confirmation').removeClass("d-inline");
      $("#info-modal").modal('show');
      $(".fa-eye-slash").css("color", "#9b9b9b");

      filechange = false;
      statuschange = false;
      //borra datos anteriores
      var arraymultiselect=[];
      var arraymultiselectChild=[];
      array_child_edited = [];
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
        if(!is_multiple){new_icon.style.background = father_status.status_color;}
        document.getElementById("status_container_info").appendChild(new_icon);
        var new_p = document.createElement('SELECT');
        new_p.className = "multiselect_field form-control form-control-sm multiselect_status input_status info_input_disabled";
        new_p.style.width="90%";
        new_p.setAttribute("onChange","changeStatus(event)");
        new_p.disabled = true;
        var status_options = data_status.data;
        var found_status = false;
        status_options.forEach(function(status) {
          var new_option = document.createElement('OPTION');
          new_option.text=status.name;
          if(status.status_type=="Heredable"){
            new_option.disabled = true;
          }
          new_option.value=status.id+"|"+status.color;
          if(father_status.status_id==status.id){
            found_status=true;
            new_option.selected = true;
          }
          new_p.appendChild(new_option);
        });
        if(!found_status || is_multiple){new_p.selectedIndex = -1;}
        document.getElementById("status_container_info").appendChild(new_p);
          $('.multiselect_status').multiselect({
                maxHeight: 450,
                buttonClass: 'text-left mb-1 form-control form-control-sm input_status info_input_disabled',
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

      //campos del registro
      father_fields = data.father_fields;
      var subtitles_all = [];
      var subtitles_all_child = [];
      var verify_count_elements = 0; // variable para chequear que se dibujan todos los campos sin error
      father_fields.forEach(function(element) {
        if (element.field_type_id == 7 && element.value.length == 0) {} else {
          if (element.field_type_id != 7) { //dibuja campo padre
            var new_row = document.createElement('DIV');
            if (element.hidden) {
              new_row.className = "form-row d-none hidden_field row_field";
            } else {
              new_row.className = "form-row row_field";
            }
            if(element.can_read==false){
                new_row.classList.add('canot_read');
              }
            if ((element.value == null && element.field_type_id != 11) || (element.value == "" && element.field_type_id != 11) || (element.value == " " && element.field_type_id != 11)) {
              new_row.classList.add("d-none");
              new_row.classList.add("empty_field");
            }
            if (subtitles_all.indexOf(element.field_id) >= 0) {
              new_row.classList.add("d-none");
              new_row.classList.add("subtile_hidden" + element.field_id);
            }
            var new_celd = document.createElement('DIV');
            if (element.field_type_id == 11) {
              new_celd.className = "col-md-12";
            } else {
              new_celd.className = "col-md-5";
            }
            var new_p = document.createElement('H6');
            if (element.field_type_id == 11) {
              new_p.className = "bg-primary pl-1";
              new_p.style.cursor = "pointer";
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
              new_celd.className = "col-md-7 field_div";
              if(element.field_type_id == 10){new_celd.classList.add("ok_button")}

              // Adapta el código a los diferentes tipos de campos
              if (element.field_type_id == 1) {
                var new_p = document.createElement('TEXTAREA');
                new_p.className = "form-control form-control-sm info_input_disabled textarea_input";
                if(element.key=="app_usuario"){new_p.classList.add('app_usuario_value')}
                if(!is_multiple){
                  new_p.setAttribute("onChange","calculate_all(false)");
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
                  if(element.read_only==true || element.can_edit==false){
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
                new_p.setAttribute('onChange', 'changeFile()');
                if(found_nested){
                  new_p.setAttribute('onChange', 'set_nested(event)');
                }
                if(element.data_script!=""){
                  if(!is_multiple){
                    if(element.value==null){isnull_value=null}else{isnull_value="\""+element.value+"\""}
                    new_p.setAttribute('onChange', 'set_script( '+element.data_script+ ',' +element.field_type_id+ ',' +element.field_id +',' +isnull_value+',' +found_nested+',event  )');
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
                    new_p.setAttribute('onChange', 'set_script( '+element.data_script+ ',' +element.field_type_id+ ',' +element.field_id +',' +isnull_value+',' +false +',event )');
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
                  new_p.setAttribute("onChange","calculate_all(false)");
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
              if(element.read_only==true || element.can_edit==false || (is_multiple && element.calculated_field!="") || (is_multiple && element.data_script!="") ){
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
          else {// Dibuja campos hijos
            var new_row = document.createElement('DIV');
            if (element.hidden) {
              new_row.className = "d-none hidden_field";
            }

            if (subtitles_all.indexOf(element.field_id) >= 0) {
              new_row.classList.add("d-none");
              new_row.classList.add("subtile_hidden" + element.field_id);
            }
            var new_celd = document.createElement('DIV');
            var new_p = document.createElement('H6');
            new_p.innerHTML = element.name + ":";
            new_p.style.borderBottom = "solid 1px";
            new_p.style.display = "inline-block";
            new_celd.appendChild(new_p);
            new_row.appendChild(new_celd);
            child_elements = element.value;
            var verify_count_elements_childs = 0;
            child_elements.forEach(function(element_child) {
              var new_row1 = document.createElement('DIV');
              new_row1.className = "form-row";
              var new_celd = document.createElement('DIV');
              new_celd.className = "col-md-5 ml-3";
              var new_p = document.createElement('H6');
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
              new_row.appendChild(new_row1);

              //campos de los hijos
              children_fields = element_child.children_fields;
              var verify_count_elements_childs_fields = 0;
              children_fields.forEach(function(element_child_field) {
                var new_row1 = document.createElement('DIV');
                if (element_child_field.hidden) {
                  new_row1.className = "form-row d-none hidden_field";
                } else {
                  new_row1.className = "form-row";
                }
                if ((element_child_field.value == null && element_child_field.field_type_id != 11) || (element_child_field.value == "" && element_child_field.field_type_id != 11) || (element_child_field.value == " " && element_child_field.field_type_id != 11)) {
                  new_row1.classList.add("d-none");
                  new_row1.classList.add("empty_field");
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
                if(element_child_field.can_read==false){
                    new_celd.classList.add('canot_read');
                }
                var new_p = document.createElement('H6');
                if (element_child_field.field_type_id == 11) {
                  new_p.className = "bg-primary pl-1";
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
                  new_p.id=element.field_id+"|child|"+element_child.children_id+"|"+element_child_field.field_type_id+"|"+element_child_field.field_id;
                }
                new_p.style.margin = "0px";
                new_celd.appendChild(new_p);
                new_row1.appendChild(new_celd);


                if (element_child_field.field_type_id != 11) {
                  var new_celd = document.createElement('DIV');
                  new_celd.className = "col-md-6 field_div";

                  // Adapta el código a los diferentes tipos de campos
                  if (element_child_field.field_type_id == 1) {
                    var new_p = document.createElement('TEXTAREA');
                    new_p.className = "form-control form-control-sm info_input_disabled textarea_input is_child_field";
                    new_p.style.minHeight = '22px';
                    new_p.setAttribute('onChange','changeChild('+element_child.children_id+')')
                  }
                  var found_nested = false;
                  if (element_child_field.field_type_id == 2 || element_child_field.field_type_id == 10) {
                    var new_p = document.createElement('SELECT');
                    if(element_child_field.field_type_id == 10){
                      new_p.multiple = true;
                    }
                    new_p.className = "multiselect_field form-control form-control-sm info_input_disabled is_child_field";
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
                          //comentado hasta edición de hijos
                         // set_error_message("Error en subformulario, listados anidados : "+element_child_field.name);
                        }
                      }
                      var new_p_nested = document.createElement('SELECT');
                      new_p_nested.className = "mb-1 multiselect_field form-control form-control-sm info_input_disabled is_child_field";
                      new_p_nested.disabled = true;
                      if(element_child_field.required==true){
                        new_p_nested.classList.add('required_field');
                      }
                      if(element_child_field.read_only==true || element_child_field.can_edit==false){
                        new_p_nested.classList.add('readonly_field');
                      }
                      var id_field = element_child_field.field_id;
                      var id_child = element_child.children_id;
                      var id_field_nested = element.field_id+"_nested";
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
                            //Comentado hasta la edición de hijos
                            //set_error_message("Error en subformulario, listados: "+element_child_field.name);
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
                  }
                  if (element_child_field.field_type_id == 3) {
                    var new_p = document.createElement('INPUT');
                    new_p.className = "form-control form-control-sm info_input_disabled date_field is_child_field";
                  }
                  if (element_child_field.field_type_id == 4) {
                    var new_p = document.createElement('SELECT');
                    new_p.className = "form-control form-control-sm info_input_disabled is_child_field";
                    var new_option = document.createElement('OPTION');
                    new_option.text="SI";
                    new_option.value="true";
                    new_p.appendChild(new_option);
                    var new_option = document.createElement('OPTION');
                    new_option.text="NO";
                    new_option.value="false";
                    new_p.appendChild(new_option);
                    new_p.setAttribute('onChange','changeChild('+element_child.children_id+')')
                  }
                  if (element_child_field.field_type_id == 5) {
                    var new_p = document.createElement('INPUT');
                    new_p.type = "number";
                    new_p.className = "form-control form-control-sm info_input_disabled is_child_field";
                    new_p.setAttribute('onChange','changeChild('+element_child.children_id+')')
                  }
                  new_p.disabled = true;
                  if (element_child_field.value != null && element_child_field.field_type_id != 10 && element_child_field.field_type_id != 2) {
                    new_p.value = element_child_field.value
                  }
                  if(element_child_field.required==true){
                    new_p.classList.add('required_field');
                  }
                  if(element_child_field.read_only==true || element_child_field.can_edit==false){
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
                new_row.appendChild(new_row1);
                verify_count_elements_childs_fields++;
              });
              if(verify_count_elements_childs_fields!= children_fields.length){
                set_error_message("Error: no se pudieron traer todos los campos del subformulario "+element.name);
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
                new_row.appendChild(new_div);
                verify_count_elements_childs_photos++;
              });
              if(verify_count_elements_childs_photos!= children_photos.length){
                set_error_message("Error: no se pudieron traer todas las fotos del campo "+element.name);
              }
              verify_count_elements_childs++;
            }); //termina for Each childs
            if(verify_count_elements_childs!= child_elements.length){
              set_error_message("Error: no se pudieron traer todos los subformularios del campo "+element.name);
            }
            document.getElementById('info_body').appendChild(new_row);
          }
        }
        verify_count_elements ++;
      }); // termina for Each de padres

      if(verify_count_elements!= father_fields.length){
        set_error_message("Error: no se pudieron traer todos los campos");
      }

      textarea_adjust_height();
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
          changeChild(this.id.split('|')[2]);
        } else{
          if(!is_multiple){
            calculate_all(false);
          } else{
            changeFile();
          }
        }
    });

      // selectores y multiselectores en hijos
       for(x=0;x<arraymultiselect.length;x++){
              if(document.getElementById('fieldchildid|'+arraymultiselect[x]+'|'+arraymultiselectChild[x]).classList.contains("readonly_field")){
                var buttonClass = 'text-left form-control form-control-sm info_input_disabled readonly_field is_child_field';
              } else{
                var buttonClass = 'text-left form-control form-control-sm info_input_disabled is_child_field';
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

      //Muestra el punto en el mapa y elimina el seleccionado en la tabla
      if (from_map) {
        $('table tbody tr').removeClass('found');
        Navarra.project_types.config.data_dashboard = "app_id = '" + appid_info + "'";
        Navarra.project_types.config.item_selected = appid_info;
        Navarra.geomaps.current_layer();
      }
      //Ejecuta Script de campos padres
        father_fields.forEach(function(element) {
          if(element.data_script!=""){
            Navarra.calculated_and_script_fields.Script(element.data_script,element.field_type_id,element.field_id,element.value,true);
          }
        });
        calculate_all(true);

    }//end Success
  }); //end ajax
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
  if (fields != "") {
    fields.forEach(function(field_id) {
      if ($(".subtile_hidden" + ischild + field_id).length > 0) {
        $(".subtile_hidden" + ischild + field_id).not('.empty_field').not('.hidden_field').removeClass("d-none");
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
  textarea_adjust_height()
  //verifica requeridos si no es edición múltiple

  var required_field_number = 0;
  $('#info_messages').html("");
  $('#alert_text_message').html("");
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

  if(!filechange && array_child_edited.length==0){
    if(!statuschange){
      $('#info_messages').html("No hay cambios a guardar");
      $('#info_messages').addClass("text-danger");
      $('#info_messages').removeClass("d-none");
    } else {
      edit_file_status(false);
    }
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
    console.log("Padre a actualizar")
    console.log(properties_to_save)

  //envio de Json hijos
  var child_edited_all = [];
  if(array_child_edited.length>0){
    array_child_edited = array_child_edited.unique();
    for(z=0;z<array_child_edited.length;z++){
      var properties_child_to_save = new Object();
      var id_field_father_properties;
      $('.field_key_child_json').each(function() {
        id_field_father_properties = this.id.split('|')[0];
        var id_child_properties = this.id.split('|')[2];
        var fiel_type_properties = this.id.split('|')[3];
        var id_field_child_properties = this.id.split('|')[4];

        if(id_child_properties==array_child_edited[z]){
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
      child_data.IdFather = Navarra.project_types.config.id_item_displayed;
      child_data.field_id = id_field_father_properties;
      child_data.child_id = array_child_edited[z];
      child_data.properties = properties_child_to_save;
      child_edited_all.push(child_data);
    }
  }

  console.log("Hijos a actualizar")
  console.log(child_edited_all);

  $.ajax({
    type: 'PATCH',
    url: '/projects/update_form',
    datatype: 'JSON',
    data: {
      app_ids: app_ids,
      properties: JSON.stringify(properties_to_save),
      subforms: child_edited_all
    },
    success: function(data) {
      $(".fakeLoader").css("display", "none");
      filechange = false;
      array_child_edited = [];
      $('#table_select_all').prop('checked',false);
      if(!$('#multiple_edit').hasClass('multiple_on')){
        $('#info_messages').addClass("d-inline");
        $('#info_messages').removeClass("d-none");
        $('#info_messages').html(data['status']);
      } else{
        $('#alert_message').addClass('show');
        $('#alert_message').removeClass('d-none');
        $("#info-modal").modal("hide");
        $('#alert_text_message').html(data['status']);
        Navarra.project_types.config.item_selected="";
        Navarra.project_types.config.data_dashboard = "";
      }
       //Ajustar valor en la tabla
      var fields = document.querySelectorAll(".field_key");
      fields.forEach(function(column, indexColumn) {
        if(properties_to_save[column.value]!=undefined){
          var indexval=indexColumn+1;
          app_ids.forEach(function(row_element){
            if($('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').html()!=properties_to_save[column.value] ){
              $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').html(properties_to_save[column.value]);
              $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').css("font-weight","bold");
              $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').css("font-size","1.5em");
            }
          });
        }
      })
      if(edit_status && statuschange){
        edit_file_status(true);
      } else{
        update_all();
      }
    }
  });
}

function edit_file_status(edit_data){
  $(".fakeLoader").css("display", "block");
  if(!statuschange){
    $('#info_messages').html("No hay cambios a guardar");
    $('#info_messages').addClass("text-danger");
    $('#info_messages').removeClass("d-none");
    return;
  } else {
    $('#info_messages').removeClass("text-danger");
  }
  var app_ids = getapp_ids();
  var status_id = $(".input_status").val().split('|')[0];
  $.ajax({
    type: 'PATCH',
    url: '/projects/change_status',
    datatype: 'JSON',
    data: {
      app_ids: app_ids,
      status_id: status_id
    },
    success: function(data) {
      $(".fakeLoader").css("display", "none");
      $('#table_select_all').prop('checked',false);
      if(!$('#multiple_edit').hasClass('multiple_on')){
        $('#info_messages').addClass("d-inline");
        $('#info_messages').removeClass("d-none");
        if(edit_data){
          $('#info_messages').html($('#info_messages').html()+"<br>" +data['status']);
        } else{
          $('#info_messages').html(data['status']);
        }
      } else{
        $('#alert_message').addClass('show');
        $('#alert_message').removeClass('d-none');
        $("#info-modal").modal("hide");
         if(edit_data){
          $('#alert_text_message').html($('#alert_text_message').html()+"<br>" +data['status']);
        } else{
          $('#alert_text_message').html(data['status']);
        }
        Navarra.project_types.config.item_selected="";
        Navarra.project_types.config.data_dashboard = "";
      }
       //Ajustar valor en la tabla
      var fields = document.querySelectorAll(".field_key");
      fields.forEach(function(column, indexColumn) {
        if(column.value=="app_estado"){
          var indexval=indexColumn+1;
          app_ids.forEach(function(row_element){
            $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').html(status_id);
            $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').css("font-weight","bold");
            $('#row_table_data'+row_element+' td:nth-child(' + indexval + ')').css("font-size","1.5em");
          });
        }
      })
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
      if(!$('#multiple_edit').hasClass('multiple_on')){
        $('#info_messages').addClass("d-inline");
        $('#info_messages').removeClass("d-none");
        $('#info_messages').html(data['status']);
        $('.app_usuario_value').val(user_id);
      }
      else{
        $('#alert_message').addClass('show');
        $('#alert_message').removeClass('d-none');
        $("#info-modal").modal("hide");
        $('#alert_text_message').html(data['status']);
        Navarra.project_types.config.item_selected="";
        Navarra.project_types.config.data_dashboard = "";
      }
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
      if(!$('#multiple_edit').hasClass('multiple_on')){
        $('#info_messages').addClass("d-inline");
        $('#info_messages').removeClass("d-none");
        $('#info_messages').html(data['status']);
      } else{
        $('#alert_message').addClass('show');
        $('#alert_message').removeClass('d-none');
        $("#info-modal").modal("hide");
        $('#alert_text_message').html(data['status']);
      }
      Navarra.project_types.config.item_selected="";
      Navarra.project_types.config.data_dashboard = "";
      //elimina las filas de la tabla
      app_ids.forEach(function(row_element){
        $('#row_table_data'+row_element).remove();
      })
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
      $('#alert_text_message').html(data['status']);
      Navarra.project_types.config.item_selected="";
      Navarra.project_types.config.data_dashboard = "";
      //elimina las filas de la tabla
      app_ids.forEach(function(row_element){
        $('#row_table_data'+row_element).remove();
      })
      update_all();
    }
  });
}

function getapp_ids(){
  var app_ids = [];
  if($('#multiple_edit').hasClass("multiple_on")){
    $('#table_visible .custom-control-input:checked').not('.just_header').each(function(){
      app_ids.push($(this).attr('id').split('_')[2]);
    });
    console.log(app_ids)
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
}

function set_script(data_script,field_type_id,field_id,value,isnested,event){
  // Script de campos padres
  filechange = true;
  if(data_script!=""){
    Navarra.calculated_and_script_fields.Script(JSON.stringify(data_script),field_type_id, field_id,value, false);
  }
  if(isnested){
    set_nested(event)
  }
}

function set_script_all(){
  //Ejecuta Script de campos padres
        father_fields.forEach(function(element) {
          if(element.data_script!=""){
            Navarra.calculated_and_script_fields.Script(element.data_script,element.field_type_id,element.field_id,element.value,false);
          }
        });
}

function calculate_change(calculated_field,field_type_id,field_id,value){
  if(calculated_field!=""){
    Navarra.calculated_and_script_fields.Calculate(JSON.stringify(calculated_field),field_type_id, field_id,value, "data_edition");
  }
}
function calculate_all(first_time){
  //Ejecuta Calculate de campos padres
  if(!first_time){filechange = true;}
        father_fields.forEach(function(element) {
          if(element.calculated_field!="" && element.field_type_id!=11){
            Navarra.calculated_and_script_fields.Calculate(element.calculated_field,element.field_type_id,element.field_id,element.value,"data_edition");
          }
        });
}

function set_nested(event){
  filechange = true;
  var id_event = event.target.id;
  var id_event_nested = id_event+"_nested";
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

function changeChild(id_child_edited,isnested,event){
  array_child_edited.push(id_child_edited);
  if(isnested){
    set_nested(event)
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
  if($('#table_visible .custom-control-input:checked').not('.just_header').length>=2){
    $('#multiple_edit').removeClass('d-none');
  } else{
    $('#multiple_edit').addClass('d-none');
  }
  if($('#table_visible .custom-control-input:checked').not('.just_header').length==0){
    $('#table_select_all').prop('checked',false);
  }
}

//****** TERMINAN FUNCIONES PARA EDICION DE REGISTROS *****


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
    column_visibles.push($(this).val());
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

  url = "/project_types/export_geojson.json?filter_value=" + filter_value
  + "&filter_by_column=" + filter_by_column
  + "&order_by_column=" + order_by_column
  + "&project_type_id=" + project_type_id
  + "&name_project=" + name_project
  + "&type_box=" + type_box
  + "&size_box=" + JSON.stringify(size_box)
  + "&attribute_filters=" + JSON.stringify(attribute_filters)
  + "&filtered_form_ids=" + JSON.stringify(filtered_form_ids)
  + "&from_date=" + from_date
  + "&to_date=" + to_date
  + "&fields=" + JSON.stringify(column_visibles)

  window.open(url, '_blank');

}
