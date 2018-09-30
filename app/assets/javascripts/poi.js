Navarra.namespace("pois.action_new");
Navarra.namespace("pois.action_edit");
Navarra.namespace("pois.action_update");
Navarra.namespace("pois.action_create");
Navarra.namespace("pois.action_index");

Navarra.pois.config = {
  "lon": null,
  "lat": null,
  "originalLat": null,
  "originalLon": null,
  "otherpois" : null
};

Navarra.pois.action_index = function() {

  var init = function() {
    Navarra.poi_search_panel.init();

    $('#button').on('click', function(){

      $(this).text(function(i, old){
        return old=='+ Filtros' ? 'Ocultar Filtros' : '+ Filtros';
      });
    });
  } 
  return {
    init: init
  }
}();

Navarra.pois.action_edit = function() {
  var initCitiesChosen = function() {
    $("#poi_city_id").ajaxChosen({
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

    loadPoiSubTypesCombo = function(result) {
      Navarra.common.form.loadComboOptions("#poi_poi_sub_type_id", result, "name");
    },

    loadChainsCombo = function(result) {
      Navarra.common.form.loadComboOptions("#poi_chain_id", result, "name");
    },

    loadFoodTypesCombo = function(result) {

      var location = $("#poi_city_id option:selected").text();
      var locationArr = location.split(", ");
      country = locationArr[3];
      var res = [];
      /*    if (country == 'Argentina') {
      $.each(result, function (i, val) {
        if (val.name != 'Fast Food')
          res.push(val);
      });

      Navarra.common.form.loadComboOptions("#poi_food_type_id", res, "name");
    }else
    {
      Navarra.common.form.loadComboOptions("#poi_food_type_id", result, "name");
    }
    */
      Navarra.common.form.loadComboOptions("#poi_food_type_id", result, "name");
    },

    loadLatLonFields = function() {
      $(".btn-primary").click(function(e) {
        $("#poi_latitude").attr("value", Navarra.geocoding.latitude);
        $("#poi_longitude").attr("value", Navarra.geocoding.longitude);
      });
    },

    chains = function(){
      $("#poi_chain_id").on('click',function(){

        var  option_selected;
        option_selected = $(this).find('option:selected').text();
        poi_name = $('#poi_poi_type_id').find('option:selected').text();
        if (option_selected == ''  || option_selected == undefined )
        {
          $("#poi_name").attr('readonly', false); 
          $("#poi_name").val(null); 

        }else
        {

          var  value_select = option_selected.split("|");
          $("#poi_name").val(value_select[0]);
          if (poi_name != 'Hotel' && poi_name != 'Grocery Store'){
            $("#poi_name").attr('readonly', true); 
          }
          else
          {
            $("#poi_name").attr('readonly', false); 
          }
        }

      }); 
    },

    poi_types = function(){

      $('#poi_poi_type_id').on('click', function(){


        poi_name = $('#poi_poi_type_id').find('option:selected').text();
        if (poi_name != 'Hotel' && poi_name != 'Grocery Store'){

          var  value_select = poi_name.split("-");
          //  $("#poi_name").val(value_select[0]);
          // $("#poi_name").attr('readonly', true); 
        }
        else
        {
          //  $("#poi_name").attr('readonly', false); 
        }

      });
    },

    bindAddMarkerButtonClick = function() {
      $("#add-marker-btn").click(function(e) {

        e.preventDefault();
        $(this).toggleClass("btn-success");
        Navarra.geocoding.enableMapClick($(this).hasClass("btn-success"));
      });
    },

    enable_restaurant_types = function(){
      $("#poi_city_id_chzn").on('click', function(){

        var location = $("#poi_city_id option:selected").text();
        var locationArr = location.split(", ");

        if (locationArr[3] == 'México')
        {
          $(".restaurant_types").show();    
        }
        else
        {
          $(".restaurant_types").hide();    
        }
      });
    },


    bindSuggestButtonClick = function() {
      $("#suggest-locations-btn").click(function(e) {
        e.preventDefault();

        if($("#poi_street_name").val() == '') {
          alert("Debe ingresar una Calle para poder sugerir ubicaciones.");
          return;
        }

        if($("#poi_house_number").val() == '') {
          alert("Debe ingresar Número para poder sugerir ubicaciones.");
          return;
        }

        var searchTerm = $("#poi_street_name").val() + " " + $("#poi_house_number").val();

        var options = {"searchTerm": searchTerm};

        if($("#poi_city_id").val() == '') {
          alert("Debe seleccionar una ciudad para poder sugerir ubicaciones.");
          return;
        }

        var location = $("#poi_city_id option:selected").text();
        var locationArr = location.split(", ");

        if(locationArr[0] != undefined) {
          options["location"] = locationArr[0];
        }

        if(locationArr[1] != undefined) {
          options["county"] = locationArr[2];
        }

        if(locationArr[3] != undefined) {
          options["country"] = locationArr[3];
        }

    if (Navarra.pois.supplier_map == 'here')
        {

          Navarra.geocoding.doGeocode(options);
        }else{
        
          Navarra.geocoding_ol.doGeocode(options);
        }
      });
    },

    bindPoiTypesComboChange = function() {
      $("#poi_poi_type_id").change(function() {
        if($(this).val() == '') {
          Navarra.common.form.loadComboOptions("#poi_poi_sub_type_id", [], "name");
          Navarra.common.form.loadComboOptions("#poi_chain_id", [], "name");
          Navarra.common.form.loadComboOptions("#poi_food_type_id", [], "name");
          return;
        }

        var poiTypeUrl = "/poi_types/" + $(this).val();
        var subTpesUrl = poiTypeUrl + "/sub_types";
        var chainsUrl = poiTypeUrl + "/chains";
        var foodUrl = poiTypeUrl + "/food_types";
        Navarra.common.request.getAjax(subTpesUrl, loadPoiSubTypesCombo);
        //Navarra.common.request.getAjax(chainsUrl, loadChainsCombo); Descomentar si se requiere filtrar la cadena por tipo de poi
        Navarra.common.request.getAjax(foodUrl, loadFoodTypesCombo);
      })
    },

    initControlDatePicker = function() {
      $('#poi_control_date').datepicker({dateFormat: 'dd-mm-yy'});
    };

  var load_selects = function() {
    $("#poi_chain_id").ready(function(){
      if ($('#poi_chain_id').val() != '' )
      {
        $("#poi_name").attr('readonly', true); 
      }

    })};

  var supplier_maps = function(){


       console.log(Navarra.pois.supplier_map ); 

    if (Navarra.pois.supplier_map == 'here')
    {
     Navarra.geocoding.init(
        Navarra.pois.config.lat,
        Navarra.pois.config.lon,
        Navarra.pois.config.originalLat,
        Navarra.pois.config.originalLon,
        Navarra.pois.config.otherpois
      );
    }else
    {

      Navarra.geocoding_ol.init();
    }
  }


  var init = function() {
    initCitiesChosen();
    bindPoiTypesComboChange();
    supplier_maps();
    loadLatLonFields();
    chains();
    poi_types();
    /*enable_restaurant_types();*/
    bindAddMarkerButtonClick();
    bindSuggestButtonClick();
    initControlDatePicker();
    load_selects();
  };

  return {
    init: init
  }
}();

Navarra.pois.action_new = function() {
  var bindInputFocusOut = function() {
    $("input").focusout(function(e) {
      f = $(this).closest("form").serialize();
      $.getScript('/pois/possible_duplicates.js?' + f);
    });    
  };


  var init = function() {

    Navarra.poi_search_panel.init();
    Navarra.pois.action_edit.init();
    bindInputFocusOut();
  }

  return {
    init: init
  }
}();

Navarra.pois.action_update = function() {
  var init = function() {
    Navarra.pois.action_edit.init();
  }

  return {
    init: init
  }
}();

Navarra.pois.action_create = function() {
  var init = function() {
    Navarra.pois.action_new.init();
  }

  return {
    init: init
  }
}();
