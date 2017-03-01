Navarra.poi_search_panel = function() {
  var bindPoiTypesComboChange = function() {
    $("#q_poi_type_id_eq").change(function() {
      if($(this).val() == '') {
        Navarra.common.form.loadComboOptions("#q_poi_sub_type_id_eq", [], "name");
        Navarra.common.form.loadComboOptions("#q_chain_id_eq", [], "name");
        Navarra.common.form.loadComboOptions("#q_food_type_id_eq", [], "name");
        return;
      }

      var poiTypeUrl = "/poi_types/" + $(this).val();
      var subTpesUrl = poiTypeUrl + "/sub_types";
      var chainsUrl = poiTypeUrl + "/chains";
      var foodUrl = poiTypeUrl + "/food_types";
      Navarra.common.request.getAjax(subTpesUrl, loadPoiSubTypesCombo);
      Navarra.common.request.getAjax(chainsUrl, loadChainsCombo);
      Navarra.common.request.getAjax(foodUrl, loadFoodTypesCombo);
    })
  },

  loadProvincesCombo = function(result) {
    Navarra.common.form.loadComboOptions("#q_province_id_eq", result, "name");
  },

  loadDepartmentsCombo = function(result) {
    Navarra.common.form.loadComboOptions("#q_department_id_eq", result, "name");
  },

  loadCitiesCombo = function(result) {
    Navarra.common.form.loadComboOptions("#q_city_id_eq", result, "name");
  },

  bindCountryComboChange = function() {
    $("#q_country_id_eq").change(function() {
      if($(this).val() == '') {
        Navarra.common.form.loadComboOptions("#q_province_id_eq", [], "name");

      } else {
        var locationsUrl = "/country/" + $(this).val() + "/provinces";
        Navarra.common.request.getAjax(locationsUrl, loadProvincesCombo);
      }

      $("#q_province_id_eq").change();
    });
  },

  bindProvinceComboChange = function() {
    $("#q_province_id_eq").change(function() {
      if($(this).val() == '') {
        Navarra.common.form.loadComboOptions("#q_department_id_eq", [], "name");

      } else {
        var locationsUrl = "/province/" + $(this).val() + "/departments";
        Navarra.common.request.getAjax(locationsUrl, loadDepartmentsCombo);
      }
      
      $("#q_department_id_eq").change();
    });    
  },

  bindDepartmentComboChange = function() {
    $("#q_department_id_eq").change(function() {
      if($(this).val() == '') {
        Navarra.common.form.loadComboOptions("#q_city_id_eq", [], "name");

      } else {
        var locationsUrl = "/department/" + $(this).val() + "/cities";
        Navarra.common.request.getAjax(locationsUrl, loadCitiesCombo);
      }
      
      $("#q_city_id_eq").change();
    });     
  },

  loadPoiSubTypesCombo = function(result) {
    Navarra.common.form.loadComboOptions("#q_poi_sub_type_id_eq", result, "name");
  },

  loadChainsCombo = function(result) {
    Navarra.common.form.loadComboOptions("#q_chain_id_eq", result, "name");
  },

  loadFoodTypesCombo = function(result) {
    Navarra.common.form.loadComboOptions("#q_food_type_id_eq", result, "name");
  };

  var init = function() {
    bindPoiTypesComboChange();
    bindCountryComboChange();
    bindProvinceComboChange();
    bindDepartmentComboChange();
    $('#q_control_date_gteq').datepicker({dateFormat: 'dd M yy'});
    $('#q_control_date_lteq').datepicker({dateFormat: 'dd M yy'});
  }

  return {
    init: init
  }
}();