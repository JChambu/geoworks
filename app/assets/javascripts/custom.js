
Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function init_kpi(size_box = null) {
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
  //  var conditions = Navarra.project_types.config.filter_kpi
  var conditions = Navarra.project_types.config.filter_kpi;

  $.ajax({
    type: 'GET',
    url: '/project_types/kpi.json',
    datatype: 'json',
    data: {
      data_id: data_id,
      size_box: size_box,
      graph: false,
      type_box: type_box,
      data_conditions: conditions
    },
    dashboard_id: dashboard_id,
    success: function(data) {
      data.forEach(function(element) {

        var count_element = element['data'][0]['count'];

        if(element['title'] == 'Seleccionado'){data_pagination(element['data'][0]['count'],1);}

        if (element['title'] == '% del Total') {
          data_cont = (Number(count_element)).format(2, 3, '.', ',');
        } else {
          data_cont = (Number(count_element)).format(0, 3, '.', ',');
        }

        if ($('.kpi_' + element['id']).length) {
          $('.kpi_' + element['id']).replaceWith('<div class="count kpi_' + element['id'] + '">' + data_cont + '</div>');
        } else {

          html = ' <div class="tile_stats_count">' +
            '<span class="count_top align-top">' + element['title'] + '</span>' +
            '<div class="count align-middle kpi_' + element['id'] + '"> ' + data_cont + '</div>' +
            '</div>' +
            '</div>'
          $('.tile_count').append(html);

        }

      }); // Cierra forEach
    } // Cierra success
  }); // Cierra ajax
}; // Cierra init_kpi

function capitalize(s){
  return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
};

function init_chart_doughnut(size_box = null){

  // Guardamos la posición del scroll
  var scroll = $('.graphics').scrollTop();

  if( typeof(Chart) === 'undefined'){ return; }

  // Agrega el time_slider al card de filtros
  if ($('#time_slider').length == 0) {
    init_time_slider();
  }

  if ($('.graphics').length){

    $(".chart_container").remove();

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
    var conditions = Navarra.project_types.config.filter_kpi

    $.ajax({
      type: 'GET',
      url: '/project_types/kpi.json',
      datatype: 'json',
      data: {data_id: data_id, size_box: size_box, graph: true, type_box: type_box, dashboard_id: dashboard_id, data_conditions: conditions},
      success: function(data){

        // Aplicamos drag and drop
        dragula({
          containers: Array.prototype.slice.call($('.graphics')),
          moves: function(el, container, handle) {
            return handle.classList.contains('handle') || handle.parentNode.classList.contains('handle');
          }
        });

        // Ordenamos las series por chart
        for(var i = 0; i < data.length; i ++){
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

          // Separamos las series
          $.each(reg, function(a, b){

            // Extraemos los datos de cada serie
            $.each(b, function(index, value){

              // Extraemos tipo de gráfico
              if(index == 'chart_type'){
                type_chart = value;
              }

              // Extraemos propiedades del gráfico
              if(index == 'chart_properties'){
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
              if(index == 'graphics_options'){
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

              // Extraemos el array con los datos de la serie
              if (index == 'data'){
                data_general = value;
                var lab = [];
                var da = [];

                // Extraemos los datos del array de la serie
                $.each(data_general, function(idx, vax){

                  // Burbuja
                  if (type_chart == 'bubble') {
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

                      } else {

                        lab.push(v['name'].replace("[","").replace("]",""));
                        da.push(v['count']);

                      }
                    })
                  }

                  // BAR & LINE datasets
                  if (type_chart == 'bar' || type_chart == 'line') {
                    datasets.push({
                      label: label_datasets,
                      data: da,
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
                      data: da,
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
                      data: da,
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
                      data: da,
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
                    cantidad = da.length;
                    rancolor = randomColor({
                      count: cantidad,
                      hue: color,
                      format: 'rgb',
                      seed: 1,
                    })
                    datasets.push({
                      label: label_datasets,
                      data: da,
                      backgroundColor: rancolor,
                      borderColor: 'white',
                      borderWidth: 2,
                      type: type_chart
                    });
                  }

                  // BUBBLE datasets
                  if (type_chart == 'bubble' && count_series==1) {

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
                  labels: lab,
                  datasets: datasets
                }

              } //cierra if data
            }) //cierra each b
          }) //cierra each reg

          //Valida si el chart_container no existe para entonces crearlo (Fix temporal, averiguar porque duplican los charts)
          if($("#chart_container"+graphic_id).length == 0) {


            $('.graphics').append(
              $('<div>', {
                'class': 'card text-light p-0 mb-2 chart-bg-transparent chart_container',
                'id': 'chart_container'+graphic_id
              }).append(
                $('<div>', {
                  'class': 'card-header chart-header-bg-transparent py-1 px-2',
                  'id': 'header'+graphic_id
                }).append(
                  $('<span>', { // handle
                    'class': 'fas fa-arrows-alt handle border border-dark'
                  }),
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
                    'class': 'card-body px-1 pb-0',
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
            status_view = $('#view').hasClass('view-normal');
            status_view_expanded = $('#view').hasClass('view-expanded');
            status_view_right = $('#view').hasClass('view-normal-right');

            if (status_view || status_view_right) { // Default

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
            if(status_view_expanded) { // Expanded

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
                  },{
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
                options:  option_legend
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
                options:  option_legend
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
                      var precentage = ((currentValue/total) * 100).toFixed(2)
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
                      let percentage = (value*100 / sum).toFixed(2);
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
                options:  option_legend
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
                options:  option_legend
              }
            }

            var chart_canvas = document.getElementById('canvas'+graphic_id).getContext('2d');
            var final_chart = new Chart(chart_canvas, chart_settings);

          }; //cierra if #chart_container"+graphic_id
        } //cierra for data

        // Aplicamos la posición del scroll
        if (scroll > 0) {
          $('.graphics').scrollTop(scroll);
        }

      } //cierra function data
    }) //cierra ajax
  } //cierra if graphics
  $('.modal-backdrop').remove() ;

} //cierra function init_chart_doughnut

//****** FUNCIONES PARA TABLA DE DATOS*****
// Función para traer todos los datos de los registros contenidos y filtrados
function init_data_dashboard(){
  var per_page = $(".select_perpage").html();
  var per_page_value = parseInt(per_page);
  if(!isNaN(per_page_value)){
    if($(".active_page").length==0){
      var active_page=1
    } else{
     var active_page=parseInt($(".active_page").html());
    }
    var offset_rows=per_page_value*active_page;
    // Agregar paginación en la sentencia sql
    // Ej: SELECT * FROM TableName ORDER BY id OFFSET offset_rows ROWS FETCH NEXT per_page_value ROWS ONLY;
  } 
    var filter_value=$("#choose").val();
    var filter_by_column=$(".filter_by_column").val();
    var order_by_column=$(".order_by_column").val();
    console.log(per_page_value);
    console.log(active_page);
    console.log(filter_value);
    console.log(filter_by_column);
    console.log(order_by_column);

    // Agregar filtro properties->filter_by_column like (filter_value) y order by en la setencia sql

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
    var conditions = Navarra.project_types.config.filter_kpi

//Cambiar esta petición para buscar los datos de los registros contenidos y filtrados
    $.ajax({
      type: 'GET',
      url: '/project_types/kpi.json',
      datatype: 'json',
      data: {data_id: data_id, size_box: size_box, graph: true, type_box: type_box, dashboard_id: dashboard_id, data_conditions: conditions},
      success: function(data){
        console.log(data)
        // aqui luego le voy a agregar el llenado de la tabla
        }
  })
}

//función para paginar datos
function data_pagination(selected, active_page){
  var per_page = $('.select_perpage').html();
  var per_page_value = parseInt(per_page);
  if(!isNaN(per_page_value)){
    var numbers='';
    if(active_page!=1){
      numbers+='<li class="page_back" style="cursor:pointer"><a><</a></li>';
    } else {
      numbers+='<li class="page_back invisible"><a><</a></li>';
    }
    var total_page=Math.ceil(selected/per_page_value);
    var page_hide=false;
    var page_hide1=false;
    for(i=1;i<=total_page;i++){
      if(i<=3||i>total_page-1 || i==active_page-1 || i==active_page || i==active_page+1){
        if(i==active_page){ 
          numbers+='<li><a class="page_data page_active">'+i+'</a></li>'
        } else{
          numbers+='<li><a class="page_data">'+i+'</a></li>'
        }
      } else{
        if(i<total_page-1 && !page_hide){
          numbers+='<h6 class="p-0 m-0">..</h6>';
          page_hide=true;
        }
        if(i==total_page-1 && !page_hide1){
          numbers+='<h6 class="p-0 m-0">..</h6>';
          page_hide1=true;
        }
      }
    }
    if(active_page!=total_page){
      numbers+='<li class="page_foward" style="cursor:pointer"><a>></a></li>';
    } else {
      numbers+='<li class="page_foward invisible"><a>></a></li>';
    }
    $('#page_numbers').replaceWith('<ul class="pagination pagination-sm m-0" id="page_numbers">'+numbers+'</ul>');
    } else{
    $('#page_numbers').replaceWith('<ul class="pagination pagination-sm m-0" id="page_numbers"></ul>');
    } 
  //Pagina activa
  $(".page_data").click(function(){
    active_page=parseInt($(this).html());
    data_pagination(selected,active_page);
  });   
  $(".page_back").click(function(){
      active_page--;
      data_pagination(selected, active_page);
  });    
  $(".page_foward").click(function(){
      active_page++;
      data_pagination(selected, active_page);
  });        
}
//****** TERMINAN FUNCIONES PARA TABLA DE DATOS*****


//****** FUNCIONES PARA TIMESLIDER***** 

// Función para iniciar por primera vez el timeslider
function init_time_slider(){
  var milisec_day=86400000;
  var today= new Date();
  var min_date=dateToTS(today)-15*milisec_day;
  var max_date=dateToTS(today)+15*milisec_day;
  var from_date= dateToTS(today)-2*milisec_day;
  var to_date= dateToTS(today)+2*milisec_day;  
  create_time_slider(min_date,max_date,from_date,to_date);
  // arma datetimepicker con formato incial por día y le manda los datos del timeslider
  $('#time_slider_from').datetimepicker({
    format      :   "DD/MM/YYYY",
    viewMode    :   "days", 
  });
  $('#time_slider_to').datetimepicker({
    format      :   "DD/MM/YYYY",
    viewMode    :   "days", 
  });
  $('#time_slider_from').val(tsToDate(min_date));
  $('#time_slider_to').val(tsToDate(max_date));
}
//Función para crear el time-slider al inciar y al cambiar la configuración
function create_time_slider(min_date,max_date,from_date,to_date){
  $('#filter-body').prepend(
      $('<div>', {
        'id': 'time_slider_item',
      }).append(
        $("<input>", {
          'id': 'time_slider'
        }),
        $("<div>", {
          'class': 'dropdown-divider',
        })
      )
    )
  $('#filter-body').prepend(
      $("<i>", {
        'id':'time_slider_item-save',
        'class': 'fas fa-calendar-check float-right',
        'style': 'margin-top: -16px; margin-right:4px; color: rgba(250,250,250,0.8); cursor:pointer',
        'onclick': 'set_time_slider_filter()',
      })
    )
  $('#filter-body').prepend(
      $("<i>", {
        'id':'time_slider_item-clear',
        'class': 'fas fa-calendar-times float-right',
        'style': 'margin-top: -16px; margin-right:-16px; color: rgba(250,250,250,0.8); cursor:pointer',
        'onclick': 'clear_time_slider_filter()',
      })
    )
  $("#time_slider").ionRangeSlider({
      skin: "flat",
      type: "double",
      step: 1,
      grid: true,
      min: min_date,
      max: max_date,
      from: from_date,
      to: to_date,
      prettify: tsToDate,
      onChange: function (data) {
          set_time_slider_color();
        },
      onFinish: function (data) {
          set_time_slider_values(data);
        },
      onStart: function (data) {
          set_time_slider_values(data);
        },  
    });

    $('.irs-min , .irs-max  ').css("cursor", "pointer");
    $('.irs-min , .irs-max  ').attr("data-toggle","modal");
    $('.irs-min , .irs-max  ').attr("data-target","#time-slider-modal");
    set_time_slider_color();
}

//Función que cambia el estilo del datetimepicker según la selección por día,seman,mes o año
function change_step_time_slider(){
  if($('#time_slider_step').val()=='day'){
    $("#time_slider_from , #time_slider_to").each(function(){
      $(this).val('');
      $(this).off('dp.change');
      $(this).data('DateTimePicker').destroy(); 
      $(this).datetimepicker({
        format      :   "DD/MM/YYYY",
        viewMode    :   "days", 
      });
    })
  }
  if($('#time_slider_step').val()=='week'){
    $("#time_slider_from , #time_slider_to").each(function(){
      $(this).val('');
      $(this).data('DateTimePicker').destroy(); 
      $(this).datetimepicker({
        format      :   "DD/MM/YYYY",
        viewMode    :   "days", 
        calendarWeeks: true,
      });
      $(this).on('dp.change', function (e) {
        value = $(this).val();
        dateObject=changeformatDate(value, 'day');
        number_of_week=getWeekNumber(dateObject)
        $(this).val(number_of_week[0]+'-Sem '+number_of_week[1]);
      });
    })
  }
  if($('#time_slider_step').val()=='month'){
    $("#time_slider_from , #time_slider_to").each(function(){
      $(this).val('');
      $(this).data('DateTimePicker').destroy(); 
      $(this).datetimepicker({
        format      :   "MM/YYYY",
        viewMode    :   "months", 
      });
      $(this).off('dp.change');
    }) 
  }
  if($('#time_slider_step').val()=='year'){
    $("#time_slider_from , #time_slider_to").each(function(){
      $(this).val('');
      $(this).off('dp.change');
      $(this).data('DateTimePicker').destroy();
      $(this).datetimepicker({
        format      :   "YYYY",
        viewMode    :   "years", 
      });
    })
  }
}

// Función que manda los valores del modal datetimepicker al timeslider
function set_time_slider(){
  if($("#time_slider_from").val()=='' || $("#time_slider_to").val()==''){return}
  var step_date=$('#time_slider_step').val();
  if(step_date=='day' || step_date=='month'){
    var min_date=dateToTS(new Date(changeformatDate($('#time_slider_from').val(),step_date)));
    var max_date=dateToTS(new Date(changeformatDate($('#time_slider_to').val(),step_date)));
  }
  if(step_date=='week'){
    min_date=dateToTS(getDateOfISOWeek(($('#time_slider_from').val().split('-')[1]).substring(4),$('#time_slider_from').val().split('-')[0]));
    max_date=dateToTS(getDateOfISOWeek(($('#time_slider_to').val().split('-')[1]).substring(4),$('#time_slider_to').val().split('-')[0]));
  }

  if(step_date=='day' || step_date=='month' || step_date=='week'){
    if(step_date=='day'){range=2}
    if(step_date=='week'){range=10}
    if(step_date=='month'){range=45}
    var middle_date=new Date((dateToTS(min_date)+dateToTS(max_date))/2);
    var milisec_day=86400000;
    var from_date=dateToTS(middle_date)-range*milisec_day;
    var to_date=dateToTS(middle_date)+range*milisec_day;
  }
  
  if(step_date=='year'){
    min_date=$('#time_slider_from').val();
    max_date=$('#time_slider_to').val();
    from_date=Math.floor((parseInt($('#time_slider_from').val())+parseInt($('#time_slider_to').val()))/2);
    to_date=Math.ceil((parseInt($('#time_slider_from').val())+parseInt($('#time_slider_to').val()))/2);
  }
  if(max_date<=min_date){return}
  $('#time_slider_item').remove();
  $('#time_slider_item-save').remove();
  $('#time_slider_item-clear').remove();
  $('#time-slider-modal').modal('toggle');
  clear_time_slider_filter();
  create_time_slider(min_date,max_date,dateToTS(from_date),dateToTS(to_date));
}

// función que toma el dato y lo convierte en formato "prety" para colocarlo en las etiquetas del timeslider
function tsToDate(ts) {
  var step_date=$('#time_slider_step').val();
  if(step_date=='day' || step_date=='month' || step_date=='week'){
    var lang = "es-AR";
    var d = new Date(ts);
    var d_year=d.getFullYear();
    var d_month=d.getMonth()+1;
    var d_day=d.getDate();
    if(step_date=='day'){
      var d_format = d_day+'/'+d_month+'/'+d_year;
    }
    if(step_date=='month'){
      var month_names=['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic'];
      var d_format =month_names[d_month-1]+'/'+d_year;
    }
    if(step_date=='week'){
      number_of_week=getWeekNumber(d);
      var d_format =number_of_week[0]+'-Sem '+number_of_week[1];
    }
  } else{
    d_format=ts
  }
    return d_format;  
}

// Función para colocar el timeslider en gris (no aplicado)
function set_time_slider_color(){
  var colored_element=['.irs-bar','.irs-from', '.irs-to','.irs-single', '.irs-handle>i:first-child'];
    colored_element.forEach(function(element){
      $(element).addClass('time-slider-inactive');
      $(element).removeClass('time-slider-active');
    })
}

//Función para tomar los datos del from y del to y convertirlos en fechas
function set_time_slider_values(data){
  var from_pretty= data.from_pretty;
  var to_pretty=data.to_pretty;
  var step_date=$('#time_slider_step').val();
  if(step_date=='day'){
    from_pretty=from_pretty.split('/')[2]+'-'+from_pretty.split('/')[1]+'-'+from_pretty.split('/')[0];
    to_pretty=to_pretty.split('/')[2]+'-'+to_pretty.split('/')[1]+'-'+to_pretty.split('/')[0];
  }
  if(step_date=='week'){
    var dateofweek=getDateOfISOWeek((from_pretty.split('-')[1]).substring(4),from_pretty.split('-')[0])
    from_pretty=dateofweek.getFullYear()+'-'+(dateofweek.getMonth()+1)+'-'+dateofweek.getDate();
    var dateofweek=getDateOfISOWeek((to_pretty.split('-')[1]).substring(4),to_pretty.split('-')[0])
    //+6días
    var milisec_day=86400000;
    var lastdayofweek= new Date(dateToTS(dateofweek)+6*milisec_day);
    to_pretty=lastdayofweek.getFullYear()+'-'+(lastdayofweek.getMonth()+1)+'-'+lastdayofweek.getDate();
  }
  if(step_date=='month'){
    var month_names=['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic'];
    from_pretty=from_pretty.split('/')[1]+'-'+(jQuery.inArray(from_pretty.split('/')[0], month_names)+1)+'-1';
    last_day=new Date(to_pretty.split('/')[1], (jQuery.inArray(to_pretty.split('/')[0], month_names)+1), 0);
    last_day=last_day.getDate();
    to_pretty=to_pretty.split('/')[1]+'-'+(jQuery.inArray(to_pretty.split('/')[0], month_names)+1)+'-'+last_day;
  }
  if(step_date=='year'){
    from_pretty=from_pretty+'-1-1';
    to_pretty=to_pretty+'-12-31';
  }
  from_pretty+=' 00:00';
  to_pretty+=' 23:59:59.99';
  $('time-slider-from-value').val(from_pretty);
  $('time-slider-to-value').val(to_pretty);
  console.log(from_pretty)
  console.log(to_pretty)
}

//Función para aplicar el timeslider como filtro 
function set_time_slider_filter(){
  var colored_element=['.irs-bar','.irs-from', '.irs-to','.irs-single', '.irs-handle>i:first-child'];
  colored_element.forEach(function(element){
    $(element).addClass('time-slider-active');
    $(element).removeClass('time-slider-inactive');
  });
  if($('#prev_bar')!=undefined)($('#prev_bar').remove());
  var width_clone = ( 100 * parseFloat($('.irs-bar').css('width')) / parseFloat($('.irs-bar').parent().css('width')) ) + '%';
  var left_clone = ( 100 * parseFloat($('.irs-bar').css('left')) / parseFloat($('.irs-bar').parent().css('width')) ) + '%';
  var prev_bar=$('.irs-bar').clone();
  prev_bar.attr('id','prev_bar');
  prev_bar.appendTo('.irs--flat');
  var styletext='background:#d3d800!important;left:'+left_clone+';width:'+width_clone;
  $('#prev_bar').attr('style',styletext);
  
  //toma los valores from y to
  var from_value_filter = $('time-slider-from-value').val();
  var to_value_filter = $('time-slider-to-value').val();
    /*
    agregar aquí el filtro para búsqueda por fechas
    */
}

//Función para eliminar el timeslider como filtro 
function clear_time_slider_filter(){
  if($('#prev_bar')!=undefined)($('#prev_bar').remove());
  set_time_slider_color();
  /*
    agregar aquí la eliminación del filtro para búsqueda por fechas
  */
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
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
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
function changeformatDate(d,type){
  var dateParts = d.split("/");
  if(type=='day'){
    var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
  }
  if(type=='month'){
    var dateObject = new Date(+dateParts[1], dateParts[0] - 1, +'1'); 
  }
  return dateObject;
}

//********TERMINAN FUNCIONES PARA TIMESLIDER*******