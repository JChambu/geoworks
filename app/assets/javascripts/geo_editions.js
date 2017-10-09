Navarra.namespace("geo_editions.action_index");
Navarra.namespace("geo_editions.action_new");
Navarra.namespace("geo_editions.action_edit");
Navarra.namespace("geo_editions.action_update");
Navarra.namespace("geo_editions.action_create");
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

Navarra.geo_editions.action_create = function(){

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
    console.log("prueba");
    $('#geo_edition_company').on('change', function(){
      name_company =  $('#geo_edition_company option:selected').text();
      Navarra.geo_editions.config.company =  name_company;
      Navarra.geocoding_ol.updateMap();   
      bindStreets(name_company);
    });
  }

  bindStreets= function(name_company){
console.log("com");
    combo_select = "#geo_edition_gw_calleid";
    Navarra.common.form.loadStreets(combo_select, name_company);
  }

  findGeomanid = function(){
    $('.filter').on('click', function(e){
        e.preventDefault();
        geomanid = $("#q").val();
    $.ajax({
      type: 'GET',
      url: '/geo_editions/search_blocks',
      dataType: 'json',
      data: { 'id': geomanid },
     success: function (data) {
       Navarra.geocoding_ol.addMarker_ol(data);
     }
    });
       // coord = ['-71.381399', '-41.13125'];
    });
  }
  init = function(){
//    sessionStorage.setItem('prueba', 'holamundo');
//  console.log(sessionStorage);
    loadCompany();
    Navarra.geocoding_ol.init();
    findGeomanid = findGeomanid();
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


