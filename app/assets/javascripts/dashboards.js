Navarra.namespace("dashboards.action_show");

Navarra.dashboards.action_show = function(){


  var init = function(){
    var  project_id = $("#data_id").val();
    Navarra.geomaps.init();
  }
  return {
    init: init,
  }
}();

