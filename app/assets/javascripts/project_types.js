Navarra.namespace("project_types.action_maps");
Navarra.namespace("project_types.action_dashboard");
Navarra.namespace("project_types.action_create");
Navarra.namespace("project_types.action_new");

Navarra.project_types.config = {
  filtrado: '',
  project_field:'',
  filter:'',
  input_value:'',
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

  var project_field = $('#q_project_field').val();
  var filter =$('#q_filters').val();
  var input_value =$('#q_input_value').val();

  Navarra.project_types.config.project_field = project_field;    
  Navarra.project_types.config.filter = filter;    
  Navarra.project_types.config.input_value = input_value;    
  Navarra.geo_openlayers.addMarker_op();

  //  init_chart_doughnut();
  $("#filters-modal").modal('hide');

});

Navarra.project_types.action_dashboard = function(){
  init = function(){
  var  project_id = $("#data_id").val();

        Navarra.geo_openlayers.init();
    
    

   //d3sel(); 
    /*handleIdProyecto( project_id);
    window.graphs();*/
        //init_chart_doughnut();  
       // init_kpi();
  }

  return {
    init: init,
  }
}();

Navarra.project_types.action_create = function(){
  init = function(){
   $('.enviar').on('click', function(){
    console.log("hola");
   });
  }
  return {
    init: init,
  }
}();


Navarra.project_types.action_new = function(){
  init = function(){
    console.log("aaaa");
   //e.preventDefault(); 

  };
  
  return {
    init: init,
  }
}();

