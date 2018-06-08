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
$(".right_col").css("min-height", $(window).height());
$(window).resize(function () {
  $(".right_col").css("min-height", $(window).height());
});
/** ******  /right_col height flexible  *********************** **/





function init_kpi(size_box = null){
  if (size_box== null){
    var size_box = Navarra.project_types.config.size_box;
  }

  var  data_id =  $('#data_id').val();
  $.ajax({

    type: 'GET',
    url: '/project_types/kpi.json',
    datatype: 'json',
    data: {data_id: data_id, size_box: size_box, graph: false},
    success: function(data){
      data.forEach(function(element){

        if ($('.kpi_'+ element['id']).length) {
          $('.kpi_'+element['id']).replaceWith('<div class="count  kpi_'+ element['id'] +'"><i class="fa fa-user"></i> '+ element['data']+'</div>');
        }else{


          html = ' <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">'+
            '<span class="count_top">'+element['title']+'</span>'+
            '<div class="count  kpi_'+ element['id'] +'"><i class="fa fa-user"></i> '+ element['data']+'</div>'+
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

  if( typeof (Chart) === 'undefined'){ return; }

  if ($('.graphics').length){
    $('.graphics').empty();
    if (size_box== null){
      var size_box = Navarra.project_types.config.size_box;
    }
    var  data_id =  $('#data_id').val();
    $.ajax({

      type: 'GET',
      url: '/project_types/kpi.json',
      datatype: 'json',
      data: {data_id: data_id, size_box: size_box, graph: true},
      success: function(data){
        //        data.forEach(function(element){
        for(var i = 0; i < data.length; i ++){
          var reg = data[i];
          var data_entry = {};
          var type_chart = "";
          var title = "";

          $.each(reg, function(index, value){

            if (index == 'type_chart'){
              type_chart = value[0]; 
              type_chart =  type_chart ;
            }
            if (index == 'title'){
              title = value ;
            }
            if (index == 'data'){
              data_general = value;

              var series = [];
              var lab;
              $.each(data_general, function(idx, vax){

                var da=[];
                var colorBackground = []
                lab = [];
                $.each(vax, function(i, v ){
                  lab.push(v['name']);
                  da.push(v['count']);
                  colorBackground.push(v['color'])
                });
                series.push({"data":da, "name":title});
              });

              var div_graph = document.createElement('div');
              html =  '<div class="col-md-6 col-sm-6 col-xs-12">' + 
                      '<div class="x_panel tile fixed_height_320 card">' + 
                      '<div class="x_title">'+
                      ' <h2>'+title+'</h2>'+
                      ' <ul class="nav navbar-right panel_toolbox">'+
                      '   <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>'+
                      '   <li class="dropdown"></li>'+
                      '   <li><a class="close-link"><i class="fa fa-close"></i></a></li>'+
                      ' </ul>'+
                      ' <div class="clearfix"></div>'+
                      '</div>'+
                      '<div class="ct-chart ct-chart_'+title+' ct-chart-line-classname">'

              $('.graphics').append(html);

              var options = {
                height: 200 , 
                axisX: {
                  labelInterpolationFnc: function(value, index) {
                    return index % 2 === 0 ? value : null;
                  }
                },
                plugins: [
                  Chartist.plugins.ctPointLabels({
                    labelClass: 'ct-label',
                    labelOffset: {
                      x: 0,
                      y: -10
                    },
                    textAnchor: 'middle',
                  }),
                  Chartist.plugins.legend()
                ]
              };

              var datt = {
                labels: lab,
                series: series
              }

              switch (type_chart)
              {
                case "bar":
                  new Chartist.Bar('.ct-chart_'+title, datt, options)
                  break;
                case "line":
                  new Chartist.Line('.ct-chart_'+title, datt, options)
                  break;
                case "line_area":
                  options = {
                    height: 250 , 
                    showArea: true,
                    showLine: false,
                    showPoint: false,
                    fullWidth: true,
                    axisX: {
                      showLabel: false,
                      showGrid: false
                    }
                  }

                  new Chartist.Line('.ct-chart_'+title, datt, options)
                  break;
              }

              /*              new Chartist.Line('.ct-chart_'+title, {
                labels: lab,
                series: series
              }, {
                  showArea: true,
                  showLine: false,
                  showPoint: false,
                  fullWidth: true,
                  axisX: {
                        showLabel: false,
                        showGrid: false
              }

              });*/

              close_html = '</div>'+
                '</div>'+
                '</div>';
              $('.graphics').append( close_html);
            }
          })
        }
      }
    })
  }

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

