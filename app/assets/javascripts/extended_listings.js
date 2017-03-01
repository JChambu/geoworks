Navarra.namespace("extended_listings.action_index");
Navarra.namespace("extended_listings.action_new");
Navarra.namespace("extended_listings.action_edit");

Navarra.extended_listings.action_index = function() {
  var init = function() {
    Navarra.poi_search_panel.init();
  } 

  return {
    init: init
  }
}();

Navarra.extended_listings.action_edit = function(){
  var init = function() {
    Navarra.extended_listings.action_new.init();
  }

  return {
    init: init
  }
}();

Navarra.extended_listings.action_new = function(){

  var bindInputFocusOutEl = function() {
    $("input").focusout(function(e) {
      f = $(this).closest("form").serialize();
      console.log(f);
      $.getScript('/extended_listings/possible_duplicates.js?' + f);
    });    
  };

  initCitiesChosen = function() {
    $("#extended_listing_city_id").ajaxChosen({
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
  },

    expresion = function(){
      var exp_street = /(.+)\s\d/;
      var exp_number = /\s(\d+$|\d)/;

      $("#extended_listing_street").on('blur', function(){
        value = this.value;
        string = value.replace(/([\ \t]+(?=[\  \t])|^\s+|\s+$)/g, '');
        string = string.replace(/\t/g, '');

        var street = exp_street.exec(string);
        var number = exp_number.exec(string);

        if (street == null)
        {
          $("#extended_listing_address").val(); 
        }else{
          $("#extended_listing_address").val(street[1]); 
        }


        if (number == null)
        {

          $("#extended_listing_number").val();
        }else{

          $("#extended_listing_number").val(number[1]);
        }
      });

    }

  init = function(){
    Navarra.geocoding_leaflet.init();
    initCitiesChosen();
    expresion();
    bindInputFocusOutEl();
  } 
  return {
    init: init
  }
}();
