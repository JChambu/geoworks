Navarra.namespace("poi_loads.action_index");

Navarra.poi_loads.action_index = function() {

  var refresh = function() {
    if($(".pending-status").length > 0) {
      window.setTimeout(goToIndex, 15000);  
    }    
  },

  goToIndex = function() {
    window.location = "/poi_loads";
  };

  var init = function() {
    refresh(); 
  }

  return {
    init: init
  }
}();