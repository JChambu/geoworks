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

  $.ajax({

    type: 'GET',
    url: '/project_types/kpi.json',
    datatype: 'json',
    data: {data_id: data_id, size_box: size_box, graph: false, type_box: type_box, data_conditions: data_conditions}, dashboard_id: dashboard_id,
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
    var  data_id =  Navarra.dashboards.config.project_type_id;
    var  dashboard_id =  Navarra.dashboards.config.dashboard_id;
    $.ajax({
      type: 'GET',
      url: '/project_types/kpi.json',
      datatype: 'json',
      data: {data_id: data_id, size_box: size_box, graph: true, type_box: type_box, dashboard_id: dashboard_id},
      success: function(data){

        for(var i = 0; i < data.length; i ++){
          var reg = data[i];
          var data_entry = {};
          var type_chart = "";
          var title = "";
          var chart;

          $.each(reg, function(a, b){

          $.each(b, function(index, value){

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
              var lab = [];
              var da = [];
              $.each(data_general, function(idx, vax){

                var colorBackground = "#6f98fc";

                $.each(vax, function(i, v ){
                  lab.push(v['name']);
                  da.push(v['count']);
                  // colorBackground.push(v['color'])
                });
                series.push({"data":da, "name":title});
              });


              var title_graph = title.replace(" ", "_");
              status_view = $('#view').hasClass('active');
              if (status_view){
                card_graph = 'col-md-12 col-sm-12 '
              }else{
                card_graph = 'col-md-6'
              }
              // if (type_chart == 'bar'){
              //fixed_height = 'col-md-6 col-sm-12 ';
              //  }else{
              //    fixed_height = 'col-md-6 col-sm-12 ';
              //  }
              var div_graph = document.createElement('div');
              var canvas_graph = document.createElement('canvas');
              div_graph.id = 'graph'+title;
              canvas_graph.id = 'canvas'+title;
              canvas_graph.height = 160;
              canvas_graph.width = 450;
              canvas_graph.className = 'canvas'+title ;


              html = ' <div class="pru x_content" value="'+title+'">';
              htmldiv = ' <div class="chart-container" style="position: relative; margin: auto; height:95vh; width:65vw">';

              $('.graphics').append(html);

              chartTittle="Título inicial";
              var option_legend = {
                title:{
                  display:true,
                  text: chartTittle,
                  fontSize:60
                },
                legend:{
                  display: false
                } }

              if (type_chart == 'doughnut'){

                option_legend = {
                  legend: {
                    display: true,
                    position: 'right',
                    labels: {
                      boxWidth: 5,
                      fullWidth: true,
                      fontSize: 10
                    }
                  },
                }
              }
              var chart_doughnut_settings = {
                type: type_chart,
                data: {
                  labels: lab,
                  datasets: [{
                    label: title,
                    data:  da ,
                    backgroundColor: poolColors(da.length )
                    //backgroundColor: colorBackground
                  },{}]
                },
                options:  option_legend
              }
              $('.x_content').append(htmldiv);
              $('.chart-container').append(canvas_graph);
              var cc = '#'+canvas_graph.id;
              $(cc).each(function(){

                var chart_element = $(this);
                var chart_doughnut = new Chart( chart_element, chart_doughnut_settings);

              });

              close_html = '</div>'+
                '</div>'+
'</div>';

              $('.graphics').append( close_html);
            }
          })
          })

          //
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
