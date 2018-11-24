Navarra.namespace("project_types.action_maps");
Navarra.namespace("project_types.action_dashboard");
Navarra.namespace("project_types.action_create");
Navarra.namespace("project_types.action_new");
Navarra.namespace("project_types.action_filters");

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

//$(document).on('click', '.envf', function(event){
 // console.log($('.proj_field').val());
  //console.log($('.proj_value').val());

   //var project_field = $('.proj_field').val();
//   var filter =$('#q_filters').val();
 //  var input_value =$('.proj_value').val();


//   console.log(input_value);
   //Navarra.project_types.config.project_field = project_field;    
//   Navarra.project_types.config.filter = filter;    
  // Navarra.project_types.config.input_value = input_value;    
//   Navarra.geomaps.wms_filter();
//   // Navarra.geo_openlayers.addMarker_op();
// //  init_kpi();
//   //  init_chart_doughnut();
  // $("#filters-modal").modal('hide');
//});

/*if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log('Great success! All the File APIs are supported.');
} else {
  alert('The File APIs are not fully supported in this browser.');
}*/

Navarra.project_types.action_filters = function(){

  
  init = function(){
  console.log("vasd");    
    $('#filtro').on('click', function(){
          console.log("llega");
    })

  }
  return {
    init: init,
  }
}();


Navarra.project_types.action_create = function(){
  init = function(){

    console.log("create");
    $('.project_type_file').on('change', function(e){
      handleFileSelect(e);
    });
    $('#envi').on('click', function(){
    });
  }
  function handleFileSelect(evt) {
    var files = evt.target.files[0]; // FileList object

    var data = null;
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      var csvData = event.target.result;
      data = $.csv.toArrays(csvData);
      if (data && data.length > 0) {
        console.log(data[0]);
      }
    };
    reader.onerror = function() {
      alert('Unable to read ' + file.fileName);
    };

  }
  return {
    init: init,
  }
}();


Navarra.project_types.action_new = function(){
  init = function(){

    $('.boxi').hide();
    $('#project_type_file').on('change', function(e){
      handleFileSelect(e);
    });
    $('#envi').on('click', function(){
      console.log("hola");
    });

    $('#option_geo').on('change', function(){

      value = $(this).val();
      $(this).find("option:selected").each(function(){
        var optionValue = $(this).attr("value");
        
        if(optionValue){
          $(".boxi").not("#" + optionValue).hide();
          $("#" + optionValue).show();
        } else{
          $(".boxi").hide();
        }
      });
    })
  }

  function handleFileSelect(evt) {
    var files = evt.target.files[0]; // FileList object
    var data = null;
    var file = evt.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event) {
      var csvData = event.target.result;
      data = $.csv.toArrays(csvData);
      if (data && data.length > 0) {

        data[0].forEach(function(item){
          $('#project_type_latitude, #project_type_longitude, #project_type_address, #project_type_department, #project_type_province, #project_type_country').append('<option value="'+item+'" >'+ item+'</option>');  
        })

      }
    };
    reader.onerror = function() {
      alert('Unable to read ' + file.fileName);
    };
  }
  return {
    init: init,
  }
}();

