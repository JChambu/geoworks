Navarra.namespace("geo_editions.action_index");
Navarra.namespace("geo_editions.action_new");
Navarra.namespace("geo_editions.action_edit");
Navarra.namespace("geo_editions.action_update");
Navarra.namespace("geo_editions.action_geoeditions_edit");

Navarra.geo_editions.config = {
  "line":[],
  "company": null
}
Navarra.geo_editions.action_update = function(){

  init = function(){
    Navarra.geocoding_ol.init();
    Navarra.poi_search_panel.init();
  } 
  return {
    init: init
  }
}();

Navarra.geo_editions.action_edit = function(){

  loadCompany= function(){
    $('#geo_edition_company').on('click', function(){
      name_company =  $('#geo_edition_company option:selected').text();
      Navarra.geo_editions.config.company =  name_company;
      Navarra.geocoding_ol.updateMap();   
      bindStreets(name_company);
    });
  }

  bindStreets= function(name_company){
    combo_select = "#geo_edition_gw_calleid";
    Navarra.common.form.loadStreets(combo_select, name_company);
  }

  findGeomainid = function(){
    $('#find_block').on('click', function(){

    })
  }

  init = function(){

   loadCompany();
    Navarra.geocoding_ol.init();
  } 
  return {
    init: init
  }
}();

Navarra.geo_editions.action_new = function(){
  init = function(){
    Navarra.geo_editions.action_edit.init();
  } 
  return {
    init: init
  }
}();


