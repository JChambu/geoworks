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
  $('body').removeClass('nav-md').addClass('nav-sm');
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



/** ******  tooltip  *********************** **/
$(function () {
  $('[data-toggle="tooltip"]').tooltip()

  /** ******  /tooltip  *********************** **/
  /** ******  progressbar  *********************** **/
  if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar(); // bootstrap 3
  }
  /** ******  /progressbar  *********************** **/
  /** ******  switchery  *********************** **/
  if ($(".js-switch")[0]) {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function (html) {
      var switchery = new Switchery(html, {
        color: '#26B99A'
      });
    });
  }
  /** ******  /switcher  *********************** **/
  /** ******  collapse panel  *********************** **/
  // Close ibox function
  $('.close-link').click(function () {
    console.log("cierre");
    var content = $(this).closest('div.x_panel');
    content.remove();
  });

  // Collapse ibox function
  $('.collapse-link').click(function () {
    var x_panel = $(this).closest('div.x_panel');
    var button = $(this).find('i');
    var content = x_panel.find('div.x_content');

    content.slideToggle(200);
    (x_panel.hasClass('fixed_height_390') ? x_panel.toggleClass('').toggleClass('fixed_height_390') : '');
    (x_panel.hasClass('fixed_height_320') ? x_panel.toggleClass('').toggleClass('fixed_height_320') : '');
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
    setTimeout(function () {
      x_panel.resize();
    }, 50);
  });

})
/** ******  /collapse panel  *********************** **/
/** ******  iswitch  *********************** **/
if ($("input.flat")[0]) {
  $(document).ready(function () {
    $('input.flat').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
  });
}
/** ******  /iswitch  *********************** **/
/** ******  star rating  *********************** **/
// Starrr plugin (https://github.com/dobtco/starrr)
var __slice = [].slice;

(function ($, window) {
  var Starrr;

  Starrr = (function () {
    Starrr.prototype.defaults = {
      rating: void 0,
      numStars: 5,
      change: function (e, value) {
      }
    };

    function Starrr($el, options) {
      var i, _, _ref,
        _this = this;

      this.options = $.extend({}, this.defaults, options);
      this.$el = $el;
      _ref = this.defaults;
      for (i in _ref) {
        _ = _ref[i];
        if (this.$el.data(i) != null) {
          this.options[i] = this.$el.data(i);
        }
      }
      this.createStars();
      this.syncRating();
      this.$el.on('mouseover.starrr', 'span', function (e) {
        return _this.syncRating(_this.$el.find('span').index(e.currentTarget) + 1);
      });
      this.$el.on('mouseout.starrr', function () {
        return _this.syncRating();
      });
      this.$el.on('click.starrr', 'span', function (e) {
        return _this.setRating(_this.$el.find('span').index(e.currentTarget) + 1);
      });
      this.$el.on('starrr:change', this.options.change);
    }

    Starrr.prototype.createStars = function () {
      var _i, _ref, _results;

      _results = [];
      for (_i = 1, _ref = this.options.numStars; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
        _results.push(this.$el.append("<span class='glyphicon .glyphicon-star-empty'></span>"));
      }
      return _results;
    };

    Starrr.prototype.setRating = function (rating) {
      if (this.options.rating === rating) {
        rating = void 0;
      }
      this.options.rating = rating;
      this.syncRating();
      return this.$el.trigger('starrr:change', rating);
    };

    Starrr.prototype.syncRating = function (rating) {
      var i, _i, _j, _ref;

      rating || (rating = this.options.rating);
      if (rating) {
        for (i = _i = 0, _ref = rating - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.$el.find('span').eq(i).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
        }
      }
      if (rating && rating < 5) {
        for (i = _j = rating; rating <= 4 ? _j <= 4 : _j >= 4; i = rating <= 4 ? ++_j : --_j) {
          this.$el.find('span').eq(i).removeClass('glyphicon-star').addClass('glyphicon-star-empty');
        }
      }
      if (!rating) {
        return this.$el.find('span').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
      }
    };

    return Starrr;

  })();
  return $.fn.extend({
    starrr: function () {
      var args, option;

      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.each(function () {
        var data;

        data = $(this).data('star-rating');
        if (!data) {
          $(this).data('star-rating', (data = new Starrr($(this), option)));
        }
        if (typeof option === 'string') {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);

$(function () {
  return $(".starrr").starrr();
});

$(document).ready(function () {

  $('#stars').on('starrr:change', function (e, value) {
    $('#count').html(value);
  });


  $('#stars-existing').on('starrr:change', function (e, value) {
    $('#count-existing').html(value);
  });

});
/** ******  /star rating  *********************** **/
/** ******  table  *********************** **/
$('table input').on('ifChecked', function () {
  check_state = '';
  $(this).parent().parent().parent().addClass('selected');
  countChecked();
});
$('table input').on('ifUnchecked', function () {
  check_state = '';
  $(this).parent().parent().parent().removeClass('selected');
  countChecked();
});

var check_state = '';
$('.bulk_action input').on('ifChecked', function () {
  check_state = '';
  $(this).parent().parent().parent().addClass('selected');
  countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
  check_state = '';
  $(this).parent().parent().parent().removeClass('selected');
  countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
  check_state = 'check_all';
  countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
  check_state = 'uncheck_all';
  countChecked();
});

function countChecked() {
  if (check_state == 'check_all') {
    $(".bulk_action input[name='table_records']").iCheck('check');
  }
  if (check_state == 'uncheck_all') {
    $(".bulk_action input[name='table_records']").iCheck('uncheck');
  }
  var n = $(".bulk_action input[name='table_records']:checked").length;
  if (n > 0) {
    $('.column-title').hide();
    $('.bulk-actions').show();
    $('.action-cnt').html(n + ' Records Selected');
  } else {
    $('.column-title').show();
    $('.bulk-actions').hide();
  }
}
/** ******  /table  *********************** **/
/** ******    *********************** **/
/** ******    *********************** **/
/** ******    *********************** **/
/** ******    *********************** **/
/** ******    *********************** **/
/** ******    *********************** **/
/** ******  Accordion  *********************** **/

$(function () {
  $(".expand").on("click", function () {
    $(this).next().slideToggle(200);
    $expand = $(this).find(">:first-child");

    if ($expand.text() == "+") {
      $expand.text("-");
    } else {
      $expand.text("+");
    }
  });
});

/** ******  Accordion  *********************** **/

/** ******  scrollview  *********************** **/
$(document).ready(function () {
  $(".scroll-view").niceScroll({
    touchbehavior: true,
    cursorcolor: "rgba(42, 63, 84, 0.35)"
  });

});
/** ******  /scrollview  *********************** **/

/** ******  NProgress  *********************** **/
if (typeof NProgress != 'undefined') {
  $(document).ready(function () {
    NProgress.start();
  });

  $(window).load(function () {
    NProgress.done();
  });
}
/** ******  NProgress  *********************** **/

function init_daterangepicker() {

  if( typeof ($.fn.daterangepicker) === 'undefined'){ return; }
  console.log('init_daterangepicker');

  var cb = function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
  };

  var optionSet1 = {
    startDate: moment().subtract(29, 'days'),
    endDate: moment(),
    minDate: '01/01/2012',
    maxDate: '12/31/2015',
    dateLimit: {
      days: 60
    },
    showDropdowns: true,
    showWeekNumbers: true,
    timePicker: false,
    timePickerIncrement: 1,
    timePicker12Hour: true,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: 'left',
    buttonClasses: ['btn btn-default'],
    applyClass: 'btn-small btn-primary',
    cancelClass: 'btn-small',
    format: 'MM/DD/YYYY',
    separator: ' to ',
    locale: {
      applyLabel: 'Submit',
      cancelLabel: 'Clear',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
    }
  };

  $('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));
  $('#reportrange').daterangepicker(optionSet1, cb);
  $('#reportrange').on('show.daterangepicker', function() {
    console.log("show event fired");
  });
  $('#reportrange').on('hide.daterangepicker', function() {
    console.log("hide event fired");
  });
  $('#reportrange').on('apply.daterangepicker', function(ev, picker) {
    console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
  });
  $('#reportrange').on('cancel.daterangepicker', function(ev, picker) {
    console.log("cancel event fired");
  });
  $('#options1').click(function() {
    $('#reportrange').data('daterangepicker').setOptions(optionSet1, cb);
  });
  $('#options2').click(function() {
    $('#reportrange').data('daterangepicker').setOptions(optionSet2, cb);
  });
  $('#destroy').click(function() {
    $('#reportrange').data('daterangepicker').remove();
  });

}

function init_flot_chart(){

  if( typeof ($.plot) === 'undefined'){ return; }

  console.log('init_flot_chart');

  var arr_data1 = [
    [gd(2012, 1, 1), 1],
    [gd(2012, 1, 2), 1],
    [gd(2012, 1, 3), 1],
    [gd(2012, 1, 4), 1],
    [gd(2012, 1, 5), 20],
    [gd(2012, 1, 6), 85],
    [gd(2012, 1, 7), 7]
  ];

  var arr_data2 = [
    [gd(2012, 1, 1), 82],
    [gd(2012, 1, 2), 23],
    [gd(2012, 1, 3), 66],
    [gd(2012, 1, 4), 9],
    [gd(2012, 1, 5), 119],
    [gd(2012, 1, 6), 6],
    [gd(2012, 1, 7), 9]
  ];


  var chart_plot_01_settings = {
    series: {
      lines: {
        show: false,
        fill: true
      },
      splines: {
        show: true,
        tension: 0.4,
        lineWidth: 1,
        fill: 0.4
      },
      points: {
        radius: 10,
        show: true
      },
      shadowSize: 2
    },
    grid: {
      verticalLines: true,
      hoverable: true,
      clickable: true,
      tickColor: "#d5d5d5",
      borderWidth: 1,
      color: '#fff'
    },
    colors: ["rgba(38, 185, 154, 0.38)", "rgba(3, 88, 106, 0.38)"],
    xaxis: {
      tickColor: "rgba(51, 51, 51, 0.06)",
      mode: "time",
      tickSize: [1, "day"],
      ickLength: 10,
      axisLabel: "Date",
      axisLabelUseCanvas: true,
      axisLabelFontSizePixels: 12,
      axisLabelFontFamily: 'Verdana, Arial',
      axisLabelPadding: 10
    },
    yaxis: {
      ticks: 8,
      tickColor: "rgba(51, 51, 51, 0.06)",
    },
    tooltip: false
  }

  if ($("#chart_plot_01").length){
    console.log('Plot1');
    $.plot( $("#chart_plot_01"), [ arr_data1, arr_data2 ],  chart_plot_01_settings );
  }
}


function gd(year, month, day) {
  return new Date(year, month - 1, day).getTime();
}
var randNum = function() {
  return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
};


function init_charts() {

  console.log('run_charts  typeof [' + typeof (Chart) + ']');

  if( typeof (Chart) === 'undefined'){ return; }

  console.log('init_charts');


  Chart.defaults.global.legend = {
    enabled: false
  };
}


function init_kpi(){
  var size_box = Navarra.project_types.config.size_box;

  var  data_id =  $('#data_id').val();
  $.ajax({

    type: 'GET',
    url: '/project_types/kpi.json',
    datatype: 'json',
    data: {data_id: data_id, size_box: size_box, graph: false},
    success: function(data){
      data.forEach(function(element){

        if ($('.kpi_'+ element['id']).length) {
          $('.kpi_'+element['id']).replaceWith('<div class="count  kpi_'+ element['id'] +'">'+ element['data'].length+'</div>');
        }else{


          html = ' <div class="col-md-2 col-sm-4 col-xs-6 tile_stats_count">'+
            '<span class="count_top">'+element['title']+'</span>'+
            '<div class="count  kpi_'+ element['id'] +'">'+ element['data'].length+'</div>'+
            '</div>'+
            '</div>'
          $('.tile_count').append(html);

        }


      }) 
    }});
}

function init_chart_doughnut(){

  if( typeof (Chart) === 'undefined'){ return; }

  if ($('.graphics').length){
    $('.graphics').empty();
    var size_box = Navarra.project_types.config.size_box;
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
              data_entry = value;

              var div_graph = document.createElement('div');
              var canvas_graph = document.createElement('canvas');
              div_graph.id = 'graph'+title;
              canvas_graph.id = 'canvas'+title;
              canvas_graph.height = 120;
              canvas_graph.width = 320;
              canvas_graph.className = 'canvas'+title ;

              html = '<div class="col-md-4 col-sm-4 col-xs-12">' + 
'  <div class="x_panel tile fixed_height_320 overflow_hidden">'+
'    <div class="x_title">'+
'      <h2>'+title+'</h2>'+
'      <ul class="nav navbar-right panel_toolbox">'+
'        <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>'+
'        </li>'+
'        <li class="dropdown">'+
'        </li>'+
'        <li><a class="close-link"><i class="fa fa-close"></i></a>'+
'        </li>'+
'      </ul>'+
'    <div class="clearfix"></div>'+
'    </div>'+
' <div class="x_content_'+title+'">';

              $('.graphics').append(html);

              var lab = [];
              var da=[];
              $.each(data_entry, function(i, v ){
                lab.push(i);
                da.push(v);
              });

var option_legend = {
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
                  }]
                },
                options:  option_legend
              }
              $('.x_content_'+title).append(canvas_graph);
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

          //          })
        }
      }
    })



    //}
    // }
    // }
    //});
    //}
    // });
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
/*  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";*/
colors = ['rgb(128, 0, 128)', 'rgb(255, 0, 255)' ]
return colors[i];


}


$(document).ready(function() {
  init_daterangepicker();
  init_flot_chart();
  //  init_charts(); 
  //  init_chart_doughnut();
});
