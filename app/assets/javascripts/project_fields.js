$(document).on('click', '.typef', function(event) {

  var tr = $(this).closest('tr');
  var option = $(this).val();

  if (option == 2 || option == 10) { // Listado

    tr.find('.choice_list').css("display", "block");
    tr.find('.sub_form').css("display", "none");

  } else if (option == 7) { // Sub-formulario

    tr.find('.sub_form').css("display", "block");
    tr.find('.choice_list').css("display", "none");

  } else {

    tr.find('.sub_form').css("display", "none");
    tr.find('.choice_list').css("display", "none");

  }

})
