/**
 *  * Resize function without multiple trigger
 *   *
 *    * Usage:
 *     * $(window).smartresize(function(){
 *      *     // code here
 *       * });
 *        */


color1 = '#6f98fc';
color2 = '#fce36f';
color5 = '#fb3027';
color6 = '#47fe57';
color3 = '#fd8f0c';
color4 = '#a46ffc';
color7 = '#c8fc6f';
color8 = '#6ffcfa';
colorlines = '#eeeeee';

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
  $BODY = $('body'),
  $MENU_TOGGLE = $('#menu_toggle'),
  $SIDEBAR_MENU = $('#sidebar-menu'),
  $SIDEBAR_FOOTER = $('.sidebar-footer'),
  $LEFT_COL = $('.left_col'),
  $RIGHT_COL = $('.right_col'),
  $NAV_MENU = $('.nav_menu'),
  $FOOTER = $('footer');


/** ******  left menu  *********************** **/
$(function () {
  $('#sidebar-menu li ul').slideUp();
  $('#sidebar-menu li').removeClass('active');

  $('#sidebar-menu li').on('click touchstart', function() {
    var link = $('a', this).attr('href');

    if(link) {
      window.location.href = link;
    } else {
      if ($(this).is('.active')) {
        $(this).removeClass('active');
        $('ul', this).slideUp();
      } else {
        $('#sidebar-menu li').removeClass('active');
        $('#sidebar-menu li ul').slideUp();

        $(this).addClass('active');
        $('ul', this).slideDown();
      }
    }
  });
  //Habilitar para extender menu
  // $('#menu_toggle').click(function () {
  // if ($('body').hasClass('nav-md')) {
  $('body').removeClass('nav-md').addClass('nav-md');
  $('.left_col').removeClass('scroll-view').removeAttr('style');
  $('.sidebar-footer').hide();
  /* if ($('#sidebar-menu li').hasClass('active')) {
        $('#sidebar-menu li.active').addClass('active-sm').removeClass('active');
      }
    } else {
      $('body').removeClass('nav-sm').addClass('nav-md');
      $('.sidebar-footer').show();

      if ($('#sidebar-menu li').hasClass('active-sm')) {
        $('#sidebar-menu li.active-sm').addClass('active').removeClass('active-sm');
      }
    }*/
  // });
});

/* Sidebar Menu active class */
$(function () {
  var url = window.location;
  $('#sidebar-menu a[href="' + url + '"]').parent('li').addClass('current-page');
  $('#sidebar-menu a').filter(function () {
    return this.href == url;
  }).parent('li').addClass('current-page').parent('ul').slideDown().parent().addClass('active');
});
/** ******  /left menu  *********************** **/


Number.prototype.format = function(n, x, s, c) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = this.toFixed(Math.max(0, ~~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

function init_kpi(size_box = null){
  var type_box = 'polygon';
  var data_conditions = {}
  if (size_box== null && Navarra.project_types.config.project_field == '' ){

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
  var  data_id =  Navarra.dashboards.config.project_type_id;
  var  dashboard_id =  Navarra.dashboards.config.dashboard_id;
  //  var conditions = Navarra.project_types.config.filter_kpi
  var conditions = Navarra.project_types.config.filter_kpi

  $.ajax({

    type: 'GET',
    url: '/project_types/kpi.json',
    datatype: 'json',
    data: {data_id: data_id, size_box: size_box, graph: false, type_box: type_box, data_conditions: conditions}, dashboard_id: dashboard_id,
    success: function(data){
      data.forEach(function(element){
        var count_element= element['data'][0]['count'];
        data_cont = (Number(count_element)).format(0, 3, '.', ',');
        if ($('.kpi_'+ element['id']).length) {
          $('.kpi_'+element['id']).replaceWith('<div class="count  kpi_'+ element['id'] +'"><i class="fa fa-user"></i> '+ data_cont +'</div>');
        }else{

          html = ' <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">'+
            '<span class="count_top">'+element['title']+'</span>'+
            '<div class="count  kpi_'+ element['id'] +'"> '+ data_cont +'</div>'+
            '</div>'+
            '</div>'
          $('.tile_count').append(html);
        }
      })
    }});
}

function capitalize(s){
  return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
};

function init_chart_doughnut(size_box = null){
  if( typeof(Chart) === 'undefined'){ return; }

  if ($('.graphics').length){
    $('.graphics').empty();
    var type_box = 'polygon';
    if (size_box== null){
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
    var conditions = Navarra.project_types.config.filter_kpi

    $.ajax({
      type: 'GET',
      url: '/project_types/kpi.json',
      datatype: 'json',
      data: {data_id: data_id, size_box: size_box, graph: true, type_box: type_box, dashboard_id: dashboard_id, data_conditions: conditions},
      success: function(data){

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
          var tick_substep_left
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
                if (tick_max_left == null) {
                  tick_max_left = 0;
                }

                tick_step_left = value['step_x'];
                if (tick_step_left == null) {
                  tick_step_left = 0;
                }

                tick_substep_left = value['substep_x'];
                if (tick_substep_left == null) {
                  tick_substep_left = 0;
                }

                tick_min_right = value['tick_y_min'];
                if (tick_min_right == null) {
                  tick_min_right = 0;
                }

                tick_max_right = value['tick_y_max'];
                if (tick_max_right == null) {
                  tick_max_right = 0;
                }
              }

              // Extraemos el array con los datos de la serie
              if (index == 'data'){
                data_general = value;
                var lab = [];
                var da = [];

                // Extraemos los datos del array de la serie
                $.each(data_general, function(idx, vax){

                  // Extraemos label y value de los datos
                  if (type_chart == 'bubble') {
                    $.each(vax, function(i, v ){
                  if(count_series == 0){
                    bubble_dataset_x.push(v['count']);
                  }else{
                    bubble_dataset_y.push(v['count']);
                  }
                  })

                  if(count_series == 1){
                    for(var b = 0; b < vax.length; b ++){
                     r = (parseFloat(bubble_dataset_y[b]) * parseFloat(bubble_dataset_x)) * scale;
                    bubble_dataset.push({"x":bubble_dataset_x[b], "y":bubble_dataset_y[b], "r": r });
                  }
                  }
                    count_series = 1 ;
                }else{
                  $.each(vax, function(i, v ){
                    lab.push(v['name']);
                    da.push(v['count']);
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
                      borderWidth: 3,
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

          var canvas_graph = document.createElement('canvas');
          canvas_id = ('canvas'+graphic_id);
          canvas_graph.id = canvas_id;
          canvas_graph.className = 'canvas'+graphic_id;
          htmldiv = ' <div class="chart_container'+graphic_id+'">';
          $('.graphics').append(htmldiv);
          $('.chart_container'+graphic_id).append(canvas_graph);

          //Chequeamos el estado de view
          status_view = $('#view').hasClass('active');

          if (!status_view){ //Default

            $('.chart_container'+graphic_id).addClass('col-md-12');
            aspectR ="1";
            legend_display = false;

          }else{ //Active

            $('.chart_container'+graphic_id).addClass('col-md-'+width);
            if(width == '3'){
              aspectR = "1";
            }else{
              aspectR = "2";
            }
            legend_display = true;

          }

          // BAR options
          if (type_chart == 'bar' || type_chart == 'line' || type_chart == 'area' || type_chart == 'point') {
            var option_legend = {
              responsive: true,
              aspectRatio: aspectR,
              title: {
                display: true,
                text: title,
                fontSize: 18
              },
              legend: {
                display: legend_display,
                position: 'bottom',
                labels: {
                  boxWidth: 40,
                  padding: 10,
                  usePointStyle: true,
                }
              },
              scales: {
                xAxes: [{
                  stacked: stacked,
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: label_x_axis
                  }
                }],
                yAxes: [{
                  id: 'left-y-axis',
                  position: 'left',
                  display: 'true',
                  type: 'linear',
                  ticks: {
                    suggestedMin: parseInt(tick_min_left),
                    suggestedMax: parseInt(tick_max_left),
                    stepSize: parseInt(tick_step_left),
                  },
                  stacked: stacked,
                  scaleLabel: {
                    display: true,
                    labelString: label_y_axis_left
                  },
                  gridLines: {
                    drawOnChartArea: true,
                  },
                },{
                  id: 'right-y-axis',
                  position: 'right',
                  display: display_right_y_axis,
                  type: 'linear',
                  ticks: {
                    suggestedMin: parseInt(tick_min_right),
                    suggestedMax: parseInt(tick_max_right),
                  },
                  stacked: stacked,
                  scaleLabel: {
                    display: true,
                    labelString: label_y_axis_right,
                  },
                  gridLines: {
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
            var chart_doughnut_settings = {
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
              title: {
                display: true,
                text: title,
                fontSize: 18
              },
              legend: {
                display: legend_display,
                position: 'bottom',
                labels: {
                  boxWidth: 40,
                  padding: 10,
                  usePointStyle: true,
                }
              },
              scales: {
                xAxes: [{
                  display: true,
                  ticks: {
                    suggestedMin: parseInt(tick_min_left),
                    suggestedMax: parseInt(tick_max_left),
                    stepSize: parseInt(tick_step_left),
                  },
                  stacked: stacked,
                  scaleLabel: {
                    display: true,
                    labelString: label_x_axis
                  },
                  gridLines: {
                    drawOnChartArea: true,
                  },
                }],
                yAxes: [{
                  display: true,
                  stacked: stacked,
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
            var chart_doughnut_settings = {
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
              title: {
                display: true,
                text: title,
                fontSize: 18
              },
              legend: {
                display: legend_display,
                position: 'bottom',
                labels: {
                  boxWidth: 40,
                  padding: 10,
                  usePointStyle: true,
                }
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
                  //align: 'end',
                  //offset: -5,
                  backgroundColor: function(context) {
      							return context.dataset.backgroundColor;
      						},
                  borderColor: 'white',
                  borderRadius: 25,
                  borderWidth: 2,
                  formatter: Math.round
                }
              },
            }
            var chart_doughnut_settings = {
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
              title: {
                display: true,
                text: title,
                fontSize: 18
              },
              legend: {
                display: legend_display,
                position: 'bottom',
                labels: {
                  boxWidth: 40,
                  padding: 10,
                  usePointStyle: true,
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
            var chart_doughnut_settings = {
              type: 'bubble',
              data: data_gx,
              options:  option_legend
            }
          }

          var cc = '#'+canvas_graph.id;
          $(cc).each(function(){
            var chart_element = $(this);
            var chart_doughnut = new Chart(canvas_id, chart_doughnut_settings);
            Chart.defaults.global.defaultFontFamily = 'Source Sans Pro';
          });

        } //cierra for data
      } //cierra function data
    }) //cierra ajax
  } //cierra if graphics
  $('.modal-backdrop').remove() ;
} //cierra function init_chart_doughnut
