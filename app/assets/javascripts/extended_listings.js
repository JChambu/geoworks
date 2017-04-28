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
   
    loadLatLonFieldsEl = function() {
      $(".btn-primary").click(function(e) {
        $("#extended_listing_latitude").attr("value", Navarra.geocoding_ol.latitude_ol);
        $("#extended_listing_longitude").attr("value", Navarra.geocoding_ol.longitude_ol);
      });
    },
  bindAddMarkerButtonClickEl = function() {
      $("#add-marker-btn-el").click(function(e) {

        e.preventDefault();
        $(this).toggleClass("btn-success");
        Navarra.geocoding_ol.enableMap($(this).hasClass("btn-success"));
      });
    },

  bindInputFocusOutEl = function() {
    $("input").focusout(function(e) {
      f = $(this).closest("form").serialize();
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

    bindSearchAddress = function(){
      $("#suggest-locations-btn-el").click(function(e) {
        e.preventDefault();

        if($("#extended_listing_street").val() == '') {
          alert("Debe ingresar una Calle para poder sugerir ubicaciones.");
          return;
        }

        if($("#extended_listing_number").val() == '') {
          alert("Debe ingresar Número para poder sugerir ubicaciones.");
          return;
        }

        var searchTerm = $("#extended_listing_street").val() + " " + $("#extended_listing_number").val();

        if($("#extended_listing_city_id").val() == '') {
          alert("Debe seleccionar una ciudad para poder sugerir ubicaciones.");
          return;
        }
        location_city = $("#extended_listing_city_id option:selected").text();
        options = Navarra.common.form.searchAddress(location_city );
        options["searchTerm"] = searchTerm;
        Navarra.geocoding_ol.doGeocode(options);
      })
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
    Navarra.geocoding_ol.init();
    initCitiesChosen();
   bindAddMarkerButtonClickEl();
   bindSearchAddress();
    //expresion();
    bindInputFocusOutEl();
   loadLatLonFieldsEl();
  } 
  return {
    init: init
  }
}();
