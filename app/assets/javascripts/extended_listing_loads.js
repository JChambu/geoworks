Navarra.namespace("extended_listing_loads.action_index");

Navarra.extended_listing_loads.action_index = function() {

  var refresh = function() {
    if($(".pending-status").length > 0) {
      window.setTimeout(goToIndex, 15000);  
    }    
  },

  goToIndex = function() {
    window.location = "/extended_listing_loads";
  };

  var init = function() {
    refresh(); 
  }

  return {
    init: init
  }
}();
