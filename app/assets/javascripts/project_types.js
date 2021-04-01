Navarra.namespace("project_types.action_maps");
Navarra.namespace("project_types.action_dashboard");
Navarra.namespace("project_types.action_create");
Navarra.namespace("project_types.action_new");
Navarra.namespace("project_types.action_edit");
Navarra.namespace("project_types.action_update");

Navarra.project_types.config = {
  filtrado: '',
  project_field:'',
  filter:'',
  input_value:'',
  cross_layer: '',
  cross_layer_filter: [],
  cross_layer_owner: false,
  size_box: [],
  kpi_field:'',
  kpi_filter: '',
  kpi_value: '',
  attribute_filters: [],
  filtered_form_ids: [],
  owner: false,
  field_point_colors:'',
  data_point_colors:[],
  heatmap_field: '',
  heatmap_indicator: '',
  data_dashboard:'',
  from_date: '',
  to_date: '',
  item_selected:"",
  id_item_displayed:'',
  current_layer_filters: ""
}

// Select para roles
$(document).ready(function() {
  $('.rol_select').multiselect({
    maxHeight: 500,
    buttonClass: 'form-control form-control-sm',
    buttonWidth: '100px',
    nonSelectedText: 'Seleccionar',
    allSelectedText: 'Todos',
    numberDisplayed: 1,
    nSelectedText: 'roles',
    enableFiltering: true,
    enableCaseInsensitiveFiltering: true,
    filterPlaceholder: 'Buscar',
    includeFilterClearBtn: false,
    includeSelectAllOption: true,
    selectAllText: 'Todos',
  });
});

$(document).on('click', 'form .remove_fields_2', function(event){
  $(this).closest('tr').find('input[type=hidden]').val('1');
  $(this).closest('tr').hide();
  event.preventDefault()
});
$(document).on('click', 'form .remove', function(event){
  $(this).closest('fieldset').find('input[type=hidden]').val('1');
  $(this).closest('fieldset').hide();
  event.preventDefault()
});

$(document).on('click', 'form .add_fields', function(event){
  time = new Date().getTime()
  regexp = new RegExp($(this).data('id'), 'g')

  // Agrega el nuevo item
  if ($(this).hasClass('table_father')) { // Atributo padre
    $(this).parents('table').children('tbody').prepend($(this).data('fields').replace(regexp, time))
  } else if ($(this).hasClass('table_children')) { // Atributo hijo
    $(this).closest('tr').after($(this).data('fields').replace(regexp, time))
  } else if ($(this).hasClass('chart_serie')) { // Series de gráficos
    $(this).before($(this).data('fields').replace(regexp, time))
  } else { // Resto
    $(this).before($(this).data('fields').replace(regexp, time))
  }

  event.preventDefault();
});

Navarra.project_types.action_create = function(){
  init = function(){

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


Navarra.project_types.action_edit = function(){

  init = function(){
    Navarra.project_types.action_new.init();
  }
  return{
    init:init
  }
}();


Navarra.project_types.action_new = function(){
  init = function(){

    $('.boxi').hide();
    $('#project_type_file').on('change', function(e){
      handleFileSelect(e);
    });
    $('#envi').on('click', function(){
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

$(window).on('resize', function() {
  var height_browser = window.innerHeight
  var height_table = height_browser - 320 - parseInt($("#attributes-tab").height())*1.8
  $(".table-tbody-scroll, tbody").css("height", height_table);
});

$(document).ready(function() {

  // Establece el alto de la tabla de atributos según la resolución de pantalla
  var height_browser = window.innerHeight
  var height_table = height_browser - 320 - parseInt($("#attributes-tab").height())*1.8
  $(".table-tbody-scroll, tbody").css("height", height_table);

  // Cierra el dropdown de proyectos luego de ejecutarlo
  $("#project_del_button").on("click", function() {
    $('#project_dropdown').dropdown('toggle')
  });


});
