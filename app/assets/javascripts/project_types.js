Navarra.namespace("project_types.action_maps");
Navarra.namespace("project_types.action_dashboard");

Navarra.project_types.config = {
  filtrado: '',
  size_box: []
}

$(document).on('click', 'form .remove_fields', function(event){

  $(this).prev('input[type=hidden]').val('1')
  $(this).closest('fieldset').hide()
  event.preventDefault()
});     
$(document).on('click', 'form .add_fields', function(event){
  time = new Date().getTime()
  regexp = new RegExp($(this).data('id'), 'g')
  $(this).before($(this).data('fields').replace(regexp, time))
  event.preventDefault();
});

$(document).on('click', '#enviar', function(event){

  Navarra.project_types.config.filtrado = 'SANTA FE';    
  Navarra.geo_openlayers.addMarker_op();
  init_chart_doughnut();
  $("#filters-modal").modal('hide');

});

Navarra.project_types.action_dashboard = function(){
  init = function(){

    Navarra.geo_openlayers.init();
  }

  return {
    init: init,
  }
}();





