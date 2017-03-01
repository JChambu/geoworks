Navarra.namespace("poi_address_loads.action_index");
Navarra.namespace("poi_address_loads.action_new");

Navarra.poi_address_loads.action_index = function() {
  var refresh = function() {
    if($(".pending-status").length > 0) {
      window.setTimeout(goToIndex, 15000);  
    }    
  },

  goToIndex = function() {
    window.location = "/poi_address_loads";
  };

  var init = function() {
    refresh(); 
  }

  return {
    init: init
  }
}();

Navarra.poi_address_loads.action_new = function() {
  var init = function() {

    $("#poi_address_load_city_id").ajaxChosen({
      type: 'GET',
      url: '/locations/cities',
      dataType: 'json'

    }, function (data) {
      var results = [];
      $.each(data, function (i, val) {
        results.push({value: val.value, text: val.text});
      });
      return results;
    });
  }

  return {
    init: init
  }
}();


