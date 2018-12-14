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


/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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
/** ******  right_col height flexible  *********************** **/
/*
$(".right_col").css("min-height", $(window).height());
$(window).resize(function () {
  $(".right_col").css("min-height", $(window).height());
});
*/
/** ******  /right_col height flexible  *********************** **/


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
            '<div class="count  kpi_'+ element['id'] +'"><i class="fa fa-user"></i> '+ data_cont +'</div>'+
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
          var label_y_axis;
          var label_datasets;

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
                //position_y_axis = value['position_y_axis'];
                position_y_axis = 'left-y-axis'; //harcodeado hasta que traiga el dato
                //area_fill = value['area_fill'];
                area_fill = false; //harcodeado hasta que traiga el dato
              }

              // Extraemos las opciones del gráfico
              if(index == 'graphics_options'){
                title = value['title'];
                width = value['width'];
                label_x_axis = value['label_x_axis'];
                label_y_axis = value['label_y_axis_left'];
                stacked = value['stack'];
              }

              // Extraemos el array con los datos de la serie
              if (index == 'data'){
                data_general = value;
                var lab = [];
                var da = [];

                // Extraemos los datos del array de la serie
                $.each(data_general, function(idx, vax){

                  // Extraemos label y value de los datos
                  $.each(vax, function(i, v ){
                    lab.push(v['name']);
                    da.push(v['count']);
                  });

                  // BAR & LINE datasets
                  if (type_chart == 'bar' || type_chart == 'line') {
                    datasets.push({
                      label: label_datasets,
                      data: da,
                      yAxisID: position_y_axis,
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

                  //AREA datasets
                  if (type_chart == 'area') {
                    datasets.push({
                      label: label_datasets,
                      data: da,
                      yAxisID: position_y_axis,
                      fill: true,
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
                  if (type_chart == 'bubble') {
                    datasets.push({
                      label: label_datasets,
                      data: [{
                        x: 100,
                        y: 0,
                        r: 10
                      }, {
                        x: 60,
                        y: 30,
                        r: 20
                      }, {
                        x: 40,
                        y: 60,
                        r: 25
                      }, {
                        x: 80,
                        y: 80,
                        r: 50
                      }, {
                        x: 20,
                        y: 30,
                        r: 25
                      }, {
                        x: 0,
                        y: 100,
                        r: 5
                      }],
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

          // Editar esto en la vista directamente
          status_view = $('#view').hasClass('active');
          if (!status_view){
            $('.chart_container'+graphic_id).addClass('col-md-'+width);
            if(width == '3'){
              aspectR = "1";
            }else{
              aspectR = "2";
            }

            legend_display = true;

          }else{
            $('.chart_container'+graphic_id).addClass('col-md-12');
            aspectR ="1";
            legend_display = false;
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
                  type: 'linear',
                  display: false,
                  position: 'right',
                  id: 'right-y-axis',
                  gridLines: {
                    drawOnChartArea: false,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: label_y_axis
                  }
                },{
                  type: 'linear',
                  display: true,
                  position: 'left',
                  id: 'left-y-axis',
                  gridLines: {
                    drawOnChartArea: true,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: label_y_axis
                  }
                }]
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
                  scaleLabel: {
                    display: true,
                    labelString: label_x_axis
                  }
                }],
                yAxes: [{
                  display: true,
                  scaleLabel: {
                    display: true,
                    labelString: label_y_axis
                  }
                }]
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
                    labelString: label_y_axis
                  }
                }]
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

/* OCULTA FUNCIONES SIN USO

//NB: not exhaustive, but it'll do for our usecase.
function inlineCSStoSVG(id) {
  var nodes = document.querySelectorAll("#" + id + " *");
  for (var i = 0; i < nodes.length; ++i) {
    var elemCSS = window.getComputedStyle(nodes[i], null);

    nodes[i].removeAttribute('xmlns');
    nodes[i].style.fill = elemCSS.fill;
    nodes[i].style.fillOpacity = elemCSS.fillOpacity;
    nodes[i].style.stroke = elemCSS.stroke;
    nodes[i].style.strokeLinecap = elemCSS.strokeLinecap;
    nodes[i].style.strokeDasharray = elemCSS.strokeDasharray;
    nodes[i].style.strokeWidth = elemCSS.strokeWidth;
    nodes[i].style.fontSize = "13";
    nodes[i].style.fontFamily = elemCSS.fontFamily;
    nodes[i].style.backgroundColor= elemCSS.backgroundColor;
    //Finally, solution to embbed HTML in foreignObject https://stackoverflow.com/a/37124551
    if (nodes[i].nodeName === "SPAN") {
      nodes[i].setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    }
  }
}

function exportToCanvas(id) {

  var svgElem = document.querySelector("#" + id + " svg");
  svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.canvas.height = svgElem.clientHeight;
  ctx.canvas.width = svgElem.clientWidth;

  var DOMURL = window.URL || window.webkitURL || window;
  var img = new Image();
  img.crossOrigin = "Anonymous";
  var blob = undefined;
  //IEsupport : As per https://gist.github.com/Prinzhorn/5a9d7db4e4fb9372b2e6#gistcomment-2075344
  try {
    blob = new Blob([svgElem.outerHTML], {
      type: "image/svg+xml;charset=utf-8"
    });
  }
  catch (e) {
    if (e.name == "InvalidStateError") {
      var bb = new MSBlobBuilder();
      bb.append(svgElem.outerHTML);
      blob = bb.getBlob("image/svg+xml;charset=utf-8");
    }
    else {
      throw e; //Fallthrough exception, if it wasn't for IE corner-case
    }
  }
  var url = DOMURL.createObjectURL(blob);
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    DOMURL.revokeObjectURL(url);
  }
  img.src = url;

}



var poolColors = function (a) {
  var pool = [];
  for(i=0;i<a;i++){
    pool.push(dynamicColors(i));
  }
  return pool;
}

var dynamicColors = function(i) {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
  //colors = ['rgb(128, 0, 128)', 'rgb(255, 0, 255)' ]
  //return colors[i];


}

function d3sel(event){
  var mySVG = document.querySelector('#svblock'), // Inline SVG element
    tgtImage = document.querySelector('#diagram_png'),    // Where to draw the result
    can = document.createElement('canvas'), // Not shown on page
    ctx = can.getContext('2d'),
    loader = new Image; // Not shown on page


  loader.width  = 300;
  loader.height = 300;

  loader.onload = function() {
    ctx.drawImage( loader, 0, 0, loader.width, loader.height );
    tgtImage.src = can.toDataURL();
  };
  var svgAsXML = (new XMLSerializer).serializeToString( mySVG );
  loader.src = 'data:image/svg+xml,' + encodeURIComponent( svgAsXML );

}
*/
