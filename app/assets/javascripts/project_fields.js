$(document).on('click', '.typef', function(event) {

  var tr = $(this).closest('tr');
  var option = $(this).val();

  // Listado
  if (option == 2 || option == 10) {
    tr.find('.choice_list').attr('disabled', false);
  }
})
