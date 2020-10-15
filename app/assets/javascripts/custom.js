
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

    $('#filter-body').prepend(
      $('<div>', {
        'id': 'time_slider_item'
      }).append(
        $("<input>", {
          'id': 'time_slider'
        }),
        $("<div>", {
          'class': 'dropdown-divider',
        })
      )
    )

    var lang = "es-AR";
    var year = 2019;

    function dateToTS(date) {
      return date.valueOf();
    }

    function tsToDate(ts) {
      var d = new Date(ts);

      return d.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });
    }

    $("#time_slider").ionRangeSlider({
      skin: "flat",
      type: "double",
      grid: true,
      min: dateToTS(new Date(year, 10, 1)),
      max: dateToTS(new Date(year, 11, 1)),
      from: dateToTS(new Date(year, 10, 8)),
      to: dateToTS(new Date(year, 10, 23)),
      prettify: tsToDate
    });

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

          // Agrupamos los labels y los datos para luego poder ajustar las series con los mismos valores en el eje x
          var lab_all=[];//variable que agrupa los labels de cada serie
          var da_all=[];//Variable que agrupa los datos de cada serie
          var lab_acumulado=[];//variable que acumula todos los labels de todas las series
          
          // Separamos las series
          $.each(reg, function(a, b){

            // Extraemos los datos de cada serie
            $.each(b, function(index, value){

              // Extraemos tipo de gráfico
              if(index == 'chart_type'){
                type_chart = value;
              }

              // Extraemos el array con los datos de la serie
              if (index == 'data'){
                data_general = value;
                var lab = [];
                var da = [];

                // Extraemos los datos del array de la serie
                $.each(data_general, function(idx, vax){
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
                        lab_acumulado=lab;

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

            //Verifica valores del label en el eje x si hay más de una serie
            if(lab_all.length>1){
            Array.prototype.unique=function(a){
              return function(){return this.filter(a)}}(function(a,b,c){return c.indexOf(a,b+1)<0
            });

            lab_acumulado=lab_acumulado.unique();//elimina valores duplicados
            lab_acumulado=lab_acumulado.sort();//ordena con sort, lo que coloca los null al final
            lab_acumulado=lab_acumulado.sort(function (a, b) {
              if(a!=null){
                return a.localeCompare(b);
              }              
              });//lo ordena en español para colocar la ñ en su lugar. sort() la coloca al final
            var indexnull=lab_acumulado.indexOf(null);
            if(indexnull>=0){lab_acumulado[indexnull]='sin datos'}
            for(var l=0;l<lab_all.length;l++){//búsqueda para todas las series
              //Ordenamos el array traído de la base de datos
              var lab_temporal_ordenado=lab_all[l].slice().sort();
              var lab_temporal_ordenado=lab_temporal_ordenado.sort(function (a, b) {
                if(a!=null){return a.localeCompare(b);}     
              });//lo ordena en español
              var indexnull=lab_temporal_ordenado.indexOf(null);
              if(indexnull>=0){lab_temporal_ordenado[indexnull]='sin datos'}
              var indexnull=lab_all[l].indexOf(null);
              if(indexnull>=0){lab_all[l][indexnull]='sin datos'}
              var lab_temporal=[];
              var da_temporal=[];
              for(var t=0;t<lab_temporal_ordenado.length;t++){
                for(var tt=0;tt<lab_all[l].length;tt++){
                  if(lab_temporal_ordenado[t]==lab_all[l][tt]){
                    lab_temporal.push(lab_all[l][tt]);
                    da_temporal.push(da_all[l][tt]);
                  }
                }
              }
              lab_all[l]=lab_temporal.slice();
              da_all[l]=da_temporal.slice();
              for(var a=0;a<lab_acumulado.length;a++){
                if(lab_all[l][a]!=lab_acumulado[a]){
                    lab_all[l].splice(a,0,lab_acumulado[a]);// si no encuentra el label lo agrega en el eje x
                    da_all[l].splice(a,0,0);//y agrega valor 0 para el eje y
                }
              }
            }
          }// fin de unificación de labels en el eje x para varias series

          // Arranca armando series
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

              if (index == 'data'){
                data_general = value;
                

                // Extraemos los datos del array de la serie
                $.each(data_general, function(idx, vax){
                  var idx_index=idx.substring(5)
    
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
                  labels: lab_acumulado,
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
            status_view = $('#view').hasClass('active');

            if (!status_view) { // Default

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


            } else { // Expanded

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
