$(document).on('click', '.typef', function(event) {

  var tr = $(this).closest('tr');
  var option = $(this).val();

  // Listado
  if (option == 2 || option == 10) {
    tr.find('.choice_list').attr('disabled', false);
  }

  // Sub-formulario
  if (option == 7) {
    tr.find('.sub_form').css("visibility", "visible");
  }
  
})
