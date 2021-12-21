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
  from_date_subforms: '',
  to_date_subforms: '',
  item_selected:"",
  id_item_displayed:'',
  current_layer_filters: ""
}

// Select para roles
$(document).ready(function() {
  multiselect_permissions_group();    
});

function multiselect_permissions_group () {
  $('.rol_select').multiselect({
    maxHeight: 500,
    buttonClass: 'form-control form-control-sm',
    nonSelectedText: 'Seleccionar',
    allSelectedText: 'Todos',
    numberDisplayed: 3,
    nSelectedText: 'roles',
    enableFiltering: true,
    enableCaseInsensitiveFiltering: true,
    filterPlaceholder: 'Buscar',
    includeFilterClearBtn: false,
    includeSelectAllOption: true,
    selectAllText: 'Todos',
  });
};

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

$(document).ready(function() {
  update_sort_table();    
});

// Dropdown select project type fields to show
function toggle_tables_project_type (dropdown_click,clicked_group,second_group,dropdown_second_group,third_group,dropdown_third_group) {
    
  if(clicked_group.hasClass("d-none")){
    clicked_group.each(function(index, value){
      $(this).removeClass("d-none");
    });
    dropdown_click.addClass("d-none");
  }
  if(!second_group.hasClass("d-none")){
    second_group.each(function(index, value){
      $(this).addClass("d-none");
    });
    dropdown_second_group.removeClass("d-none");
  }
  if(!third_group.hasClass("d-none")){
    third_group.each(function(index, value){
      $(this).addClass("d-none");
    });
    dropdown_third_group.removeClass("d-none");
  }
}

var table_toggler_status = "atributos";
$(document).ready( function(){
  $('.dropdown_logic').click(function(){
    toggle_tables_project_type($(".dropdown_logic"),$(".logic_cell_group"),$(".attributes_cell_group"),$(".dropdown_attributes"),$(".permissions_cell_group"),$(".dropdown_permissions"));
    table_toggler_status = "logica";
  });
  $('.dropdown_permissions').click(function(){
    toggle_tables_project_type($(".dropdown_permissions"),$(".permissions_cell_group"),$(".attributes_cell_group"),$(".dropdown_attributes"),$(".logic_cell_group"),$(".dropdown_logic"));
    table_toggler_status = "autorizaciones";
  });
  $('.dropdown_attributes').click(function(){
    toggle_tables_project_type($(".dropdown_attributes"),$(".attributes_cell_group"),$(".logic_cell_group"),$(".dropdown_logic"),$(".permissions_cell_group"),$(".dropdown_permissions")); 
    table_toggler_status = "atributos";
  });

});

var index_of_current_position = 0;

$(document).ready( function(){
  $('.add_attributes_project_types').click(function(){
    
    index_of_current_position =  $(this).parent().find('.project_fields_current_position').val();
    $(".button_add_attributes_project_types").click();
  })
  $('.add_attributes_project_types_subfield').click(function(){
    index_of_current_position =  $(this).parent().find('.project_fields_current_position').val();
    var previous_tr = $(this).parent().prevAll(".tr_project_type_group");
    var current_add_subform = previous_tr.find(".sub_form_added");
    $(current_add_subform).last().click()
    
  })
});

function update_sort_table() {
  
  $("tbody").find('tr').each(function(index) {
    $(this).find('.project_fields_current_position').val(index + 1);
    
  });
}

function update_project_type_table() {
  if(table_toggler_status=="atributos") {
    toggle_tables_project_type($(".dropdown_attributes"),$(".attributes_cell_group"),$(".logic_cell_group"),$(".dropdown_logic"),$(".permissions_cell_group"),$(".dropdown_permissions"))
  }
  if(table_toggler_status=="logica") {
    toggle_tables_project_type($(".dropdown_logic"),$(".logic_cell_group"),$(".attributes_cell_group"),$(".dropdown_attributes"),$(".permissions_cell_group"),$(".dropdown_permissions"))
  }
  if(table_toggler_status == "autorizaciones") {
    toggle_tables_project_type($(".dropdown_permissions"),$(".permissions_cell_group"),$(".attributes_cell_group"),$(".dropdown_attributes"),$(".logic_cell_group"),$(".dropdown_logic"))
  }
}

$(document).on('click', 'form .add_fields', function(event){
  time = new Date().getTime()
  regexp = new RegExp($(this).data('id'), 'g')

  // Agrega el nuevo item
  if ($(this).hasClass('table_father')) { // Atributo padre
    $(".tr_project_field").eq(index_of_current_position-1).after($(this).data('fields').replace(regexp, time))
    update_project_type_table();
    
  } else if ($(this).hasClass('table_children')) { // Atributo hijo
    if(index_of_current_position==0) {
      index_of_current_position =  $(event.target).closest($(".tr_project_field")).find('.project_fields_current_position').val()
      
      
      $(".tr_project_field").eq(index_of_current_position-1).after($(this).data('fields').replace(regexp, time))
      index_of_current_position = 0;
    } else{
    $(".tr_project_field").eq(index_of_current_position-1).after($(this).data('fields').replace(regexp, time))
    index_of_current_position = 0;
    }
    update_project_type_table();
  } else if ($(this).hasClass('chart_serie')) { // Series de gráficos
    $(this).before($(this).data('fields').replace(regexp, time))
  } else { // Resto
    $(this).before($(this).data('fields').replace(regexp, time))
  }
  event.preventDefault()
  multiselect_permissions_group()
  update_sort_table()
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
  resize_table_project_types();
});

$(document).ready(function() {
  resize_table_project_types();
  // Cierra el dropdown de proyectos luego de ejecutarlo
  $("#project_del_button").on("click", function() {
    $('#project_dropdown').dropdown('toggle')
  });
});

function resize_table_project_types(){
  // Establece el alto de la tabla de atributos según la resolución de pantalla
  var height_browser = window.innerHeight
  var head_height = $("#thead_edit_table").outerHeight();
  var button_group_height = $("#button_container_project_type").outerHeight();
  var thead_position = $("#thead_edit_table").offset().top;
  var height_navbar = $("#nav_bar").outerHeight();
  var height_table = parseInt(height_browser - thead_position - head_height -button_group_height - height_navbar + 10)+"px";
  $(".table-tbody-scroll, tbody").css("height", height_table);
}
