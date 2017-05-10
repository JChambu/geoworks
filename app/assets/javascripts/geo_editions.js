Navarra.namespace("geo_editions.action_index");
Navarra.namespace("geo_editions.action_new");
Navarra.namespace("geo_editions.action_edit");
Navarra.namespace("geo_editions.action_geoeditions_edit");

Navarra.geo_editions.config = {
  "line":[]
}



Navarra.geo_editions.action_edit = function(){

 init = function(){
    Navarra.geocoding_ol.init();
    Navarra.poi_search_panel.init();
  } 
  return {
    init: init
  }
}();
  
Navarra.geo_editions.action_new = function(){
 init = function(){
    Navarra.geocoding_ol.init();
    Navarra.poi_search_panel.init();
   // initCitiesChosen();
   //bindAddMarkerButtonClickEl();
   //bindSearchAddress();
    //expresion();
   // bindInputFocusOutEl();
   //loadLatLonFieldsEl();
 //bindPoiTypesComboChangeEl();
   //loadPoiSubTypesComboEl();
  } 
  return {
    init: init
  }
}();


Navarra.geo_editions.action_geoeditions_edit = function(){
 init = function(){
    Navarra.geocoding_ol.init();


 }

  return {
    init: init
  }
}();
