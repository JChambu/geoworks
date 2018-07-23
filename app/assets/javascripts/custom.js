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


Number.prototype.format = function(n, x, s, c) {
      var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

      return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};


function init_kpi(size_box = null){
  if (size_box== null){
    //var size_box = Navarra.project_types.config.size_box;
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
          $('.kpi_'+element['id']).replaceWith('<div class="count  kpi_'+ element['id'] +'"><i class="fa fa-user"></i> '+ element['data'][0]['count']+'</div>');
        }else{
          var count_element= element['data'][0]['count'];
          console.log(count_element);
          html = ' <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">'+
            '<span class="count_top">'+element['title']+'</span>'+
            '<div class="count  kpi_'+ element['id'] +'"><i class="fa fa-user"></i> '+ (Number(count_element)).format(0, 3, '.', ','); +'</div>'+
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
//      var size_box = Navarra.project_types.config.size_box;
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
          var chart;

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
              var title_graph = title.replace(" ", "_");
              html =  
                '<div class="col-md-6 col-sm-6 col-xs-12">' + 
                '<div class="x_panel tile fixed_height_390 card">' + 
                '<div class="x_title">'+
                ' <h2>'+title+'</h2>'+
                ' <ul class="nav navbar-right panel_toolbox">'+
                '   <li><a class="collapse-link" ><i class="fa fa-chevron-up"></i></a></li>'+
                '   <li class="dropdown"></li>'+
                '   <li><a class="close-link"><i class="fa fa-close"></i></a></li>'+
                ' </ul>'+
                ' <div class="clearfix"></div>'+
                '</div>'+
                '<div class="ct-chart ct-chart_'+title_graph+' ct-chart-line-classname" id="ct-chart_'+title_graph+'">'

              $('.graphics').append(html);



              var datt = {
                labels: lab,
                series: series
              }

              switch (type_chart)
              {
                case "bar":
                  options = {
                    plugins: [
                            Chartist.plugins.ctBarLabels()
                          ],
                  }
                chart =  new Chartist.Bar('.ct-chart_'+title_graph, datt, options)
                  break;

                case "horizontalBar":
                  options = {
                    height: 300 , 
                    axisY: {
                          offset: 102
                        },
                    textAnchor: 'middle',
                    plugins: [
                            Chartist.plugins.ctBarLabels()
                          ],
                    horizontalBars: true,
                  }
                chart =  new Chartist.Bar('.ct-chart_'+title_graph, datt, options)
                  break;
                
                
                case "line":

              options = {
                height: 200 , 
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
                chart =   new Chartist.Line('.ct-chart_'+title_graph, datt, options)
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
                  chart =new Chartist.Line('.ct-chart_'+title_graph, datt, options)
                  break;
              }

/*chart.on('draw', function(data) {
      inlineCSStoSVG(chart.container.id);
    });*/
              /*document.getElementById("rasterCanvas").addEventListener('click', function() {
                      exportToCanvas(chart.container.id);
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


/*$(document).ready(function() {
   d3sel(); 
})*/
