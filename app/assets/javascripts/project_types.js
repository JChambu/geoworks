Navarra.namespace("project_types.action_maps");
Navarra.namespace("project_types.action_dashboard");



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


Navarra.project_types.action_dashboard = function(){

  init = function(){
    Navarra.geo_openlayers.init();
}
  return {
    init: init
  }
}();





