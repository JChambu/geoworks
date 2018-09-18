Navarra.namespace("dashboards.action_show");


Navarra.dashboards.config = {
  "lon": [],
  "lat": [],
  "project_type_id": null,
  size_box: []
};


Navarra.dashboards.action_show = function(){

  var init = function(){
    var  project_id = $("#data_id").val();
    Navarra.geomaps.init();
  }
  return {
    init: init,
  }
}();

