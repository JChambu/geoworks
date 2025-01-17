Navarra.namespace("calculated_and_script_fields");
Navarra.calculated_and_script_fields = function() {

  function Script(data_script, field_type_id , field_id , value, initial, isparent) {
    var is_multiple = $('#multiple_edit').hasClass("multiple_on");
    var scriptString = data_script;
    var field_type = field_type_id
    var id_field = field_id;
    if(isparent){
      var texto_campo_id = "#field_id_"+id_field;
    } else{
      var texto_campo_id = "#fieldchildid\\|"+id_field.split('|')[0]+"\\|"+id_field.split('|')[1];
    }

    if(field_type==4){
      // si el campo tipo booleano tiene un Script y viene con valor nulo, se asigna valor = false por primera vez
      if(value==null && initial && !is_multiple){$(texto_campo_id).val("false")}
      try{
        var scriptObj = JSON.parse(scriptString);
        if($(texto_campo_id).val()=="true"){
          var scriptTrue = scriptObj.true;
        } else{
          var scriptTrue = scriptObj.false;
        }
        script_ejecute(scriptTrue, initial, field_id, isparent);
      } catch(e){
        set_error_message("Error en el atributo script del campo ID:"+field_id);
      }
    }
    if((field_type==10 || field_type==2)){
      try{
        var scriptObjMulti = JSON.parse(scriptString);
        var arrayMultiOption_keys = Object.keys(scriptObjMulti);
        if($(texto_campo_id).val()!=null){
          if(field_type == 2){
            var valueObj = [];
            valueObj.push($(texto_campo_id).val());
          } else {
            var valueObj = $(texto_campo_id).val();
          }
          for(xx=0;xx<arrayMultiOption_keys.length;xx++){
            var encontro = false;
            var scriptObj = scriptObjMulti[arrayMultiOption_keys[xx]];
            for(j=0;j<valueObj.length;j++){
              if(valueObj[j]==arrayMultiOption_keys[xx]){
                //está seleccionado
                scriptTrue = scriptObj.true;
                encontro = true;
              }
            }
            if(encontro==false){
              scriptTrue = scriptObj.false;
            }
            script_ejecute(scriptTrue, initial, field_id, isparent);
          }
        }
      } catch(e){
        set_error_message("Error en el atributo script del campo ID:"+field_id);
      }
    }
  }

  function script_ejecute(scriptTrue, initial, field_id, isparent){
    var is_multiple = $('#multiple_edit').hasClass("multiple_on");
    try {
      var hiddenTrue = JSON.parse(scriptTrue.hiddenTrue);
      var hiddenFalse = JSON.parse(scriptTrue.hiddenFalse);
      var requiredTrue = JSON.parse(scriptTrue.requiredTrue);
      var requiredFalse = JSON.parse(scriptTrue.requiredFalse);
      var readOnlyTrue = JSON.parse(scriptTrue.readOnlyTrue);
      var readOnlyFalse = JSON.parse(scriptTrue.readOnlyFalse);

      if(!is_multiple){
        for(x=0;x<hiddenTrue.length;x++){
          if(isparent){
            hiddenTrue.forEach(function(elemento) {
              search_subtitle = $('#subtitleid_' + elemento);
              if (search_subtitle.length==1) {
                $('#subtitleid_' + elemento).addClass("d-none");
                $('#subtitleid_' + elemento).addClass("hidden_field");
              }
            });
            var texto_campo_id_script = "#field_id_"+hiddenTrue[x];
          } else{
            var texto_campo_id_script = "#fieldchildid\\|"+hiddenTrue[x]+"\\|"+field_id.split('|')[1];
          }
          if($(texto_campo_id_script).length>0){
            hiddenTrue.forEach(function(elemento) {
              search_subtitle = $('#subtitleid_' + elemento);
              if (search_subtitle.length==1) {
                $('#subtitleid_' + elemento).addClass("d-none");
                $('#subtitleid_' + elemento).addClass("hidden_field");
              }
            });

            $(texto_campo_id_script).parent().closest('.row_field').addClass("d-none");
            $(texto_campo_id_script).parent().closest('.row_field').addClass("hidden_field");
          }
        }
        for(x=0;x<hiddenFalse.length;x++){
          if(isparent){
            hiddenFalse.forEach(function(elemento) {
              search_subtitle = $('#subtitleid_' + elemento);
              if (search_subtitle.length==1) {
                $('#subtitleid_' + elemento).removeClass("d-none");
                $('#subtitleid_' + elemento).removeClass("hidden_field");
              }
            });
            var texto_campo_id_script = "#field_id_"+hiddenFalse[x];
          } else {
            var texto_campo_id_script = "#fieldchildid\\|"+hiddenFalse[x]+"\\|"+field_id.split('|')[1];
          }

          if($(texto_campo_id_script).length>0){
            if(initial){
              hiddenFalse.forEach(function(elemento) {
                search_subtitle = $('#subtitleid_' + elemento);
                if (search_subtitle.length==1) {
                  $('#subtitleid_' + elemento).removeClass("d-none");
                  $('#subtitleid_' + elemento).removeClass("hidden_field");
                }
              });
              $(texto_campo_id_script).parent().closest('.row_field').not('.empty_field').removeClass("d-none");
              $(texto_campo_id_script).parent().closest('.row_field').removeClass("hidden_field");
            } else {
              hiddenFalse.forEach(function(elemento) {
                search_subtitle = $('#subtitleid_' + elemento);
                if (search_subtitle.length==1) {
                  $('#subtitleid_' + elemento).removeClass("d-none");
                  $('#subtitleid_' + elemento).removeClass("hidden_field");
                }
              });
              $(texto_campo_id_script).parent().closest('.row_field').removeClass("d-none");
              $(texto_campo_id_script).parent().closest('.row_field').removeClass("hidden_field");
            }
          }
        }
        for(x=0;x<requiredTrue.length;x++){
          if(isparent){
            var texto_campo_id_script = "#field_id_"+requiredTrue[x];
          } else {
            var texto_campo_id_script = "#fieldchildid\\|"+requiredTrue[x]+"\\|"+field_id.split('|')[1];
          }
          if($(texto_campo_id_script).length>0){
            $(texto_campo_id_script).addClass("required_field");
          }
        }
        for(x=0;x<requiredFalse.length;x++){
          if(isparent){
            var texto_campo_id_script = "#field_id_"+requiredFalse[x];
          } else {
            var texto_campo_id_script = "#fieldchildid\\|"+requiredFalse[x]+"\\|"+field_id.split('|')[1];
          }
          if($(texto_campo_id_script).length>0){
            $(texto_campo_id_script).removeClass("required_field");
            $(texto_campo_id_script).parent().closest('div').css("border-bottom","none");
          }
        }
        for(x=0;x<readOnlyTrue.length;x++){
          if(isparent){
            var texto_campo_id_script = "#field_id_"+readOnlyTrue[x];
          } else {
            var texto_campo_id_script = "#fieldchildid\\|"+readOnlyTrue[x]+"\\|"+field_id.split('|')[1];
          }
          if($(texto_campo_id_script).length>0){
            $(texto_campo_id_script).addClass("readonly_field");
          }
        }
        for(x=0;x<readOnlyFalse.length;x++){
          if(isparent){
            var texto_campo_id_script = "#field_id_"+readOnlyFalse[x];
          } else {
            var texto_campo_id_script = "#fieldchildid\\|"+readOnlyFalse[x]+"\\|"+field_id.split('|')[1];
          }
          if($(texto_campo_id_script).length>0){
            $(texto_campo_id_script).removeClass("readonly_field");
          }
        }
      }

      var scriptValue = scriptTrue.setValue;
      var arraykeys = Object.keys(scriptValue);
      for(x=0;x<arraykeys.length;x++){
        if(isparent){
          var texto_campo_id_script = "#field_id_"+arraykeys[x];
        } else{
          var texto_campo_id_script = "#fieldchildid\\|"+arraykeys[x]+"\\|"+field_id.split('|')[1];
        }
        if($(texto_campo_id_script).length>0){
          if(!is_multiple){
            $(texto_campo_id_script).val(scriptValue[arraykeys[x]]);
            if($(texto_campo_id_script).hasClass('multiselect_field')){
              $(texto_campo_id_script).multiselect('rebuild');
            }
          } else{
            $(texto_campo_id_script).addClass('readonly_field');
          }
        }
        textarea_adjust_height();
      }
    } catch(e){
      set_error_message("Error en la configuración del script del campo ID:"+field_id);
    }
  }

  function Calculate(calculated_field, field_type_id , field_id , value, edition_type, field_key, geom, isparent){
    var is_multiple = $('#multiple_edit').hasClass("multiple_on");
    try{
      var CalculateObj = JSON.parse(calculated_field);
      var field_type = field_type_id
      var id_field = field_id;
      if(isparent){
          var texto_campo_id = "#field_id_"+id_field;
          var texto_campo_id_js = "field_id_"+id_field;
      } else{
          var texto_campo_id = "#fieldchildid\\|"+id_field.split('|')[0]+"\\|"+id_field.split('|')[1];
          var texto_campo_id_js = "fieldchildid|"+id_field.split('|')[0]+"|"+id_field.split('|')[1];
      }
      var valueObj = $(texto_campo_id).val();
      var CalculateObj_keys = Object.keys(CalculateObj);

      //Cálculos permitidos al crear y editar datos
      if(edition_type=="data_edition" || edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){

          if(CalculateObj_keys[k]=="datos_capa_hijo"){
            var project_selected = Navarra.project_types.config.item_selected

            if(project_selected == ''){
              project_selected = Navarra.project_types.config.id_item_displayed
            } else {
              project_selected = Navarra.project_types.config.item_selected
            }

            var field_id_calculated = field_id
            var project_id = CalculateObj.datos_capa_hijo.project_id
            var field_id =  CalculateObj.datos_capa_hijo.field_id
            var subfield_ids = JSON.parse(CalculateObj.datos_capa_hijo.subfield_id)
            var campos_asociar = CalculateObj.datos_capa_hijo.campos_asociar
            var current_field_type_id = Navarra.dashboards.config.project_type_id

            $.ajax({
              type: 'GET',
              url: '/project_fields/get_other_layer_data',
              datatype: 'JSON',
              data: {
                project_selected: project_selected,
                current_field_type_id: current_field_type_id,
                project_id: project_id,
                field_id: field_id,
                subfield_ids: subfield_ids,
                campos_asociar: campos_asociar
              },
              success: function(data) {
                query_data_children = data.query_data_children

                let arrayListDatosCapa = [];
                let newScript = "";

                for (let den = 0; den < query_data_children.length; den++) {
                  let data_new = "";
                  for (let yy = 0; yy < subfield_ids.length; yy++) {
                    let subfield_id = subfield_ids[yy];
                    data_new += query_data_children[den][subfield_id] + " ";
                  }

                  arrayListDatosCapa.push(data_new);

                  if (den === 0) {
                    newScript += "{";
                  }

                  newScript += "\"" + data_new + "\":{\"true\":{\"hiddenTrue\":\"[]\",\"hiddenFalse\":\"[]\",\"requiredTrue\":\"[]\",\"requiredFalse\":\"[]\",\"readOnlyTrue\":\"[]\",\"readOnlyFalse\":\"[]\",\"setValue\":{";

                  let campos_data = Object.keys(campos_asociar);
                  let first_element = 0;

                  for (let i = 0; i < campos_data.length; i++) {
                    let keyD = campos_data[i];
                    let campo_to = campos_asociar[keyD];
                    let campo_from = query_data_children[den][keyD] || "";

                    if (first_element !== 0) {
                      newScript += ",";
                    }

                    newScript += "\"" + campo_to + "\":\"" + campo_from + "\"";
                    first_element++;
                  }

                  newScript += "}}, \"false\":{\"hiddenTrue\":\"[]\",\"hiddenFalse\":\"[]\",\"requiredTrue\":\"[]\",\"requiredFalse\":\"[]\",\"readOnlyTrue\":\"[]\",\"readOnlyFalse\":\"[]\",\"setValue\":{}}}";

                  if (den < query_data_children.length - 1) {
                    newScript += ",";
                  } else {
                    newScript += "}";
                  }
                  var data_script = newScript
                }

                var field_id = field_id_calculated
                texto_campo_id = "#fieldchildid\\|"+field_id.split('|')[0]+"\\|"+field_id.split('|')[1];
                var ulElement = $(texto_campo_id).next('.btn-group').find('ul.multiselect-container');

                arrayListDatosCapa.sort();
                var existingLiElements = ulElement.find('li');
                if (existingLiElements.length === 0) {
                  arrayListDatosCapa.forEach(function(nombre) {
                    var option = $('<option>', {
                      value: nombre,
                      text: nombre
                    });
                    $(texto_campo_id).append(option);
                    var liElement = $('<li>').appendTo(ulElement);
                    $('<a>', { tabindex: '0' }).appendTo(liElement).append('<label class="radio" title="' + nombre + '"><input type="radio" value="' + nombre + '"> ' + nombre + '</label>');
                  });
                }

                if (existingLiElements.length > 1) {
                  ulElement.empty();
                  arrayListDatosCapa.forEach(function(nombre) {
                    var option = $('<option>', {
                      value: nombre,
                      text: nombre
                    });
                    $(texto_campo_id).append(option);
                    var liElement = $('<li>').appendTo(ulElement);
                    $('<a>', { tabindex: '0' }).appendTo(liElement).append('<label class="radio" title="' + nombre + '"><input type="radio" value="' + nombre + '"> ' + nombre + '</label>');
                  });
                }

                $(texto_campo_id).on('change', function() {
                  Script(data_script, field_type_id, field_id, true, false, false);
                  var subfield_id = parseInt(texto_campo_id.match(/(\d+)/g)[0]);
                  var id_child_calculate = parseInt(texto_campo_id.match(/(\d+)/g)[1]);

                  $.ajax({
                    type: 'GET',
                    url: '/project_subfields/get_calculated_data_from_script',
                    datatype: 'JSON',
                    data: {
                      subfield_id: subfield_id
                    },
                    success: function(data) {
                      ids_with_calculated_field = data.ids_with_calculated_field
                      if (ids_with_calculated_field != null) {
                        input_to_blank = document.getElementById("fieldchildid|"+ids_with_calculated_field + "|"+ id_child_calculate).value = null;
                        input_tab = document.getElementById("fieldchildid|"+ids_with_calculated_field + "|"+ id_child_calculate).dispatchEvent(new Event('change'));
                      }
                      textarea_adjust_height();
                    }
                  });
                });

              }
            });
          }
          if(CalculateObj_keys[k]=="gwm_calculate"){
            if (isparent) {
              date_to_change = $(texto_campo_id).val();
              form_id = Navarra.project_types.config.item_selected

              if(form_id == ''){
                form_id = Navarra.project_types.config.id_item_displayed
              }

              if (date_to_change != '') {
                $.ajax({
                  type: 'POST',
                  url: '/projects/change_gwm_created_at',
                  datatype: 'JSON',
                  data: {
                    date_to_change: date_to_change,
                    form_id : form_id
                  },
                  success: function(data) {
                  }
                });
              }
            } else {
              date_to_change = $(texto_campo_id).val();
              subform_id = id_field.split('|')[1]

              if (date_to_change != undefined && subform_id != '0') {
                $.ajax({
                  type: 'POST',
                  url: '/project_data_children/change_gwm_created_at',
                  datatype: 'JSON',
                  data: {
                    date_to_change: date_to_change,
                    subform_id : subform_id
                  },
                  success: function(data) {
                  }
                });
              }
            }
          }
          if(CalculateObj_keys[k]=="calculation"){
            var calculoStringArray = CalculateObj.calculation.split("#");
            var calculoStringReplace="";
            for(ll=0;ll<calculoStringArray.length;ll++){
              if(ll % 2 == 0){
                calculoStringReplace+=calculoStringArray[ll];
              } else{
                if(isparent){
                  var val = $('#field_id_'+calculoStringArray[ll]).val();
                  if(is_multiple){
                    $('#field_id_'+calculoStringArray[ll]).addClass('readonly_field');
                  }
                } else{
                  var texto_campo_id_calculation = "#fieldchildid\\|"+calculoStringArray[ll]+"\\|"+id_field.split('|')[1];
                  var val = $(texto_campo_id_calculation).val();
                  if(is_multiple){
                    $(texto_campo_id_calculation).addClass('readonly_field');
                  }
                }
                if(val==""){val=0}
                calculoStringReplace+=val;
              }
            }
            if(!is_multiple){
              var resultado = eval(calculoStringReplace).toFixed(6).replace(/\.?0*$/, '');;
              // //redondea a dos decimales
              // resultado = Math.round(resultado * 100) / 100;
              $(texto_campo_id).val(resultado);
            }
          }
          if(CalculateObj_keys[k]=="semanaDesde"){
            if(!is_multiple){
              if(isparent){
                var val_from = $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).val();
              } else{
                var texto_campo_id_semanadesde = "#fieldchildid\\|"+CalculateObj[CalculateObj_keys[k]]+"\\|"+id_field.split('|')[1];
                var val_from = $(texto_campo_id_semanadesde).val();
              }
              if(val_from!=""){
                var dateObject = changeformatDate(val_from, 'day');
                number_of_week = getWeekNumber(dateObject)[1]
                $(texto_campo_id).val(number_of_week);
              }
            } else {
              if(isparent){
                $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).addClass('readonly_field');
              } else{
                var texto_campo_id_semanadesde = "#fieldchildid\\|"+CalculateObj[CalculateObj_keys[k]]+"\\|"+id_field.split('|')[1];
                var val_from = $(texto_campo_id_semanadesde).addClass('readonly_field');
              }
            }
          }
          if(CalculateObj_keys[k]=="temporada"){
            if(!is_multiple){
              if(isparent){
                var texto_campo_id_new = "#field_id_"+id_field;
                var val_from = $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).val();
              } else {
                var texto_campo_id_new = "#fieldchildid\\|"+CalculateObj[CalculateObj_keys[k]]+"\\|"+id_field.split('|')[1];
                var val_from = $(texto_campo_id_new).val();
              }
              if(val_from!=""){
                var mm = val_from.split("/")[1];
                var year = val_from.split("/")[2];
                if(mm>=8){
                  var next = parseInt(year) + 1;
                  var temporada = year + "/" + next;
                } else {
                  var temporada = (year - 1) + "/" + year;
                }
                $(texto_campo_id_new).val(temporada);
              }
            } else {
              if(isparent){
                $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).addClass('readonly_field');
              } else {
                var texto_campo_id_semanadesde = "#fieldchildid\\|"+CalculateObj[CalculateObj_keys[k]]+"\\|"+id_field.split('|')[1];
                var val_from = $(texto_campo_id_semanadesde).addClass('readonly_field');
              }
            }
          }
          if(CalculateObj_keys[k]=="semana"){
            // se refiere a la semana de Iscamen que comienza a medio año
            if(!is_multiple){
              if(isparent){
                var texto_campo_id_new = "#field_id_"+id_field;
                var val_from = $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).val();
              } else {
                var texto_campo_id_new = "#fieldchildid\\|"+CalculateObj[CalculateObj_keys[k]]+"\\|"+id_field.split('|')[1];
                var val_from = $(texto_campo_id_new).val();
              }
              if(val_from!=""){
                var dateObject = changeformatDate(val_from, 'day');
                actual_week = getWeekNumber(dateObject)[1];
                var ago_day = '01/08/'+val_from.split('/')[2]
                var dateObject = changeformatDate(ago_day, 'day');
                var ago_week = getWeekNumber(dateObject)[1];
                var ago_day_lastyear = '01/08/'+(val_from.split('/')[2]-1);
                var dateObject = changeformatDate(ago_day_lastyear, 'day');
                var ago_week_lastyear = getWeekNumber(dateObject)[1];
                //última semana del año anterior
                var last_week_lastyear = 0;
                for(lw=25;lw<31;lw++){
                  var last_day_lastyear = lw+'/12/'+(val_from.split('/')[2]-1);
                  var dateObject = changeformatDate(last_day_lastyear, 'day');
                  var last_week_lastyear_test = getWeekNumber(dateObject)[1];
                  if(last_week_lastyear_test>last_week_lastyear){last_week_lastyear=last_week_lastyear_test}
                }
                if(actual_week>=ago_week){
                  var weekCalculated = actual_week - ago_week + 1;
                } else {
                  var weekCalculated = parseInt(actual_week) + parseInt(last_week_lastyear - ago_week_lastyear) + 1;
                }
                $(texto_campo_id).val(weekCalculated);
              }
            } else {
              if(isparent){
                $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).addClass('readonly_field');
              } else{
                var texto_campo_id_semanadesde = "#fieldchildid\\|"+CalculateObj[CalculateObj_keys[k]]+"\\|"+id_field.split('|')[1];
                var val_from = $(texto_campo_id_semanadesde).addClass('readonly_field');
              }
            }
          }
          if(CalculateObj_keys[k]=="localidad"){
            var id_Provincia = CalculateObj.localidad.split(',')[0];
            var id_Departamento = CalculateObj.localidad.split(',')[1];
            if(!is_multiple){
              //Solución temporal para obtener las localidades cuando es registro nuevo
              //necesita que los datos de provincia y departamento hayan completado los ajax con success
              if(edition_type=="new_file"){
                var timeout_localidad = 3000;
              } else{
                var timeout_localidad = 1;
              }
              setTimeout(function(){
                if(isparent){
                    var provincia = $("#field_id_"+id_Provincia).val();
                    var departamento = $("#field_id_"+id_Departamento).val();
                } else{
                    var texto_campo_id_provincia = "#fieldchildid\\|"+id_Provincia+"\\|"+id_field.split('|')[1];
                    var texto_campo_id_departamento = "#fieldchildid\\|"+id_Departamento+"\\|"+id_field.split('|')[1];
                    var provincia = $(texto_campo_id_provincia).val();
                    var departamento = $(texto_campo_id_departamento).val();
                }
                $.getJSON('https://apis.datos.gob.ar/georef/api/localidades?provincia=%22'+provincia+'%22&departamento=%22'+departamento+'%22&orden=nombre&aplanar=true&campos=estandar&max=5000', function(data,err) {
                  // JSON result in `data` variable
                  if(err=='success'){
                    $(texto_campo_id).empty();
                    var found_option=false;
                    data.localidades.forEach(function(element) {
                      var new_option = document.createElement('OPTION');
                      new_option.text=camelCase(element.nombre);
                      new_option.value=camelCase(element.nombre);
                      if(valueObj==null && value!=null){
                        value_selected=value[0];
                      } else {
                        value_selected=valueObj;
                      }
                      if(value_selected!=null){
                        if(value_selected.toUpperCase()==element.nombre.toUpperCase()){
                          found_option=true;
                          new_option.selected = true;
                        }
                      }
                      document.getElementById(texto_campo_id_js).appendChild(new_option);
                    });
                    if(!found_option){document.getElementById(texto_campo_id_js).selectedIndex = -1;}
                    $(texto_campo_id).multiselect('rebuild');
                    if(document.getElementById(texto_campo_id_js).classList.contains('info_input_disabled')){
                        $(texto_campo_id).multiselect('disable');
                    }
                  } else {
                    set_error_message("Error en la Api de Localizaciones");
                  }
                });
              }, timeout_localidad);
            } else {
              if(isparent){
                $("#field_id_"+id_Provincia).addClass('readonly_field');
                $("#field_id_"+id_Departamento).addClass('readonly_field');
              } else{
                var texto_campo_id_provincia = "#fieldchildid\\|"+id_Provincia+"\\|"+id_field.split('|')[1];
                var texto_campo_id_departamento = "#fieldchildid\\|"+id_Departamento+"\\|"+id_field.split('|')[1];
                $(texto_campo_id_provincia).addClass('readonly_field');
                $(texto_campo_id_departamento).addClass('readonly_field');
              }
            }
          }
        }
      };

      //Cálculos permitidos al crear y editar geometrias
      if(edition_type=="geometry_edition" || edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){
          if(CalculateObj_keys[k]=="superficie"){
            area_calculated = Math.round(Navarra.geomaps.get_area()/10000*100)/100;
            if(edition_type=="geometry_edition"){
              var data_calculated = {
                id: geom.id,
                field_key: field_key,
                value_calculated: area_calculated
              }
              Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
              save_geometry_after_all_success_ajaxs();
            } else {
              $("#field_id_"+id_field).val(area_calculated);
            }
          }
          if(CalculateObj_keys[k]=="longitud"){
            if(edition_type=="geometry_edition"){
              if($('#checkbox_split_line').is(":checked")){
                long_calculated = Navarra.geomaps.get_length_split();
              } else {
                long_calculated = Math.round(Navarra.geomaps.get_length()*1000*100)/100;
              }
              var data_calculated = {
                id: geom.id,
                field_key: field_key,
                value_calculated: long_calculated
              }
              Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
              save_geometry_after_all_success_ajaxs();
            } else {
              long_calculated = Math.round(Navarra.geomaps.get_length()*1000*100)/100;
              $("#field_id_"+id_field).val(long_calculated);
            }
          }
          if(CalculateObj_keys[k]=="provincia" ){
            if(edition_type=="geometry_edition"){
              if($('#checkbox_split_line').is(":checked")){
                array_lineString = Navarra.geomaps.get_centroid_split();
                const array_provincias = array_lineString.flatMap(arr => {
                  let geom_split = arr.geometry.coordinates;
                  return $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom_split[1]+'&lon='+geom_split[0], function(data,err) {                       })
                })

                // Async function to perform execution of all promise
                let promiseExecution = async () => {
                  let promise = await Promise.all(array_provincias);
                  let result = [];
                  promise.forEach(p => {
                    result.push(p.ubicacion.provincia.nombre);
                  })
                  var data_calculated = {
                    id: geom.id,
                    field_key: field_key,
                    value_calculated: result,
                    remove_location:true
                  }
                  Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
                  save_geometry_after_all_success_ajaxs();
                };
                promiseExecution();
              } else {
                $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom.latLng.lat+'&lon='+geom.latLng.lng, function(data,err) {
                  // JSON result in `data` variable
                  if(err=='success'){
                    var data_calculated = {
                      id: geom.id,
                      field_key: field_key,
                      value_calculated: data.ubicacion.provincia.nombre,
                      remove_location:true
                    }
                    Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
                    save_geometry_after_all_success_ajaxs();
                  }
                });
              }
            } else {
              $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom.latLng.lat+'&lon='+geom.latLng.lng, function(data,err) {
              // JSON result in `data` variable
                if(err=='success'){
                $("#field_id_"+id_field).val(data.ubicacion.provincia.nombre);
                }
              });
            }
          }
          if(CalculateObj_keys[k]=="municipio"){
            if(edition_type=="geometry_edition"){
              if($('#checkbox_split_line').is(":checked")){
                array_lineString = Navarra.geomaps.get_centroid_split();
                const array_provincias = array_lineString.flatMap(arr => {
                  let geom_split = arr.geometry.coordinates;
                  return $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom_split[1]+'&lon='+geom_split[0], function(data,err) {                       })
                })

                // Async function to perform execution of all promise
                let promiseExecution = async () => {
                  let promise = await Promise.all(array_provincias);
                  let result = [];
                  promise.forEach(p => {
                    result.push(p.ubicacion.municipio.nombre);
                  })
                  var data_calculated = {
                    id: geom.id,
                    field_key: field_key,
                    value_calculated: result,
                    remove_location:true
                  }
                  Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
                  save_geometry_after_all_success_ajaxs();
                };
                promiseExecution();
              } else {
                $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom.latLng.lat+'&lon='+geom.latLng.lng, function(data,err) {
                  // JSON result in `data` variable
                  if(err=='success'){
                    var data_calculated = {
                      id: geom.id,
                      field_key: field_key,
                      value_calculated: data.ubicacion.municipio.nombre,
                      remove_location:true
                    }
                    Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
                    save_geometry_after_all_success_ajaxs();
                  }
                });
              }
            } else {
              $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom.latLng.lat+'&lon='+geom.latLng.lng, function(data,err) {
                // JSON result in `data` variable
                if(err=='success'){
                  $("#field_id_"+id_field).val(data.ubicacion.municipio.nombre);
                }
              });
            }
          }
          if(CalculateObj_keys[k]=="googleMaps"){
            if(edition_type=="geometry_edition"){
              var new_lat_marker = (marker.getLatLng().lat).toFixed(6);
              var new_long_marker = (marker.getLatLng().lng).toFixed(6);

              new_gmaps_coordinates = "https://www.google.com/maps?q="+new_lat_marker+","+new_long_marker

              var data_calculated = {
                id: geom.id,
                field_key: field_key,
                value_calculated: new_gmaps_coordinates,
                remove_location:true
              }
              Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
              save_geometry_after_all_success_ajaxs();

            } else {
              var lat_marker = (marker.getLatLng().lat).toFixed(6);
              var long_marker = (marker.getLatLng().lng).toFixed(6);

              gmaps_coordinates = "https://www.google.com/maps?q="+lat_marker+","+long_marker
              $(texto_campo_id).val(gmaps_coordinates)
            }
          };
          if(CalculateObj_keys[k]=="LatLong"){
            if(edition_type=="geometry_edition"){
              var new_lat = (marker.getLatLng().lat).toFixed(6);
              var new_long = (marker.getLatLng().lng).toFixed(6);

              new_latlong = new_lat+","+new_long

              var data_calculated = {
                id: geom.id,
                field_key: field_key,
                value_calculated: new_latlong,
                remove_location:true
              }
              Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
              save_geometry_after_all_success_ajaxs();

            } else {
              var lat = (marker.getLatLng().lat).toFixed(6);
              var long = (marker.getLatLng().lng).toFixed(6);

              latlong = lat+","+long
              $(texto_campo_id).val(latlong)
            }
          }
        }
      };

      // Cálculos permitidos al crear registro
      if(edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){
          if(CalculateObj_keys[k]=="sessionVariable"){
            // eliminado por utilizarse app_usuario
          }
          if(CalculateObj_keys[k]=="time"){
            var today=new Date();
            var dd = String(today. getDate()). padStart(2, '0');
            var mm = String(today. getMonth() + 1). padStart(2, '0');
            var yyyy = today. getFullYear();
            var hh = today.getHours();
            var min = today.getMinutes();
            today_time = dd + '/' + mm + '/' + yyyy+' '+hh+':'+min;
            $(texto_campo_id).val(today_time);
          }
          if(CalculateObj_keys[k]=="ID"){
            var today=new Date();
            var dd = String(today. getDate()). padStart(2, '0');
            var mm = String(today. getMonth() + 1). padStart(2, '0');
            var yyyy = today. getFullYear();
            var hh = String(today. getHours()). padStart(2, '0');
            var min = String(today. getMinutes()). padStart(2, '0');
            var ss = String(today. getSeconds()). padStart(2, '0');

            today_id = String(yyyy).substr(2)+mm+dd+ '.' + hh+min+ss;
            data = {
              current_tenement: Navarra.dashboards.config.current_tenement,
            }
            $.ajax({
              type: 'GET',
              url: '/users/get_user_id_and_customer_id',
              datatype: 'JSON',
              data: data,
              success: function(data) {
              var id_unique = data.customer_id + "."+data.user_id+"-"+today_id
              $(texto_campo_id).val(id_unique);
              }
            });
          }
          if(CalculateObj_keys[k]=="semanaTomate"){
            number_of_week = getWeekNumber(new Date())[1]
            $(texto_campo_id).val(number_of_week);
          }
          //Iscamen
          if(CalculateObj_keys[k]=="codigo_fenologia"){
            // es campo para hijo. Se desarrollará a continuación
          }
          if(CalculateObj_keys[k]=="datos_padre"){
            try{
              var id_field_father = CalculateObj.datos_padre.field_id;
              var value_father = $('#field_id_'+id_field_father).val();
              $(texto_campo_id).val(value_father);
              if($(texto_campo_id).hasClass('multiselect_field')){
                $(texto_campo_id).multiselect('rebuild');
              }
            } catch(e) {

            }
          }
        }
      }
    } catch(e){
      set_error_message("Error en el atributo calculado del campo ID:"+field_id);
    }
  }

  function camelCase(str) {
    var lcStr = str.toLowerCase();
    return lcStr.replace(/(?:^|\s)\w/g, function(match) {
      return match.toUpperCase();
    });
  }

  function save_geometry_after_all_success_ajaxs(){
    //manda a guardar los cambios en la geometría con los campos calulados, sólo cualdo han llegado todos los success de las peticiones ajaxs
    Navarra.dashboards.config.field_geometric_calculated_count ++;
    Navarra.dashboards.config.field_geometric_calculated_count_all ++;
    if(Navarra.dashboards.config.field_geometric_calculated_count==Navarra.dashboards.config.field_geometric_calculated_length){
      Navarra.dashboards.config.field_geometric_calculated_all.push(Navarra.dashboards.config.field_geometric_calculated);
      Navarra.dashboards.config.field_geometric_calculated_count=0;
      Navarra.dashboards.config.field_geometric_calculated=[];
      if(Navarra.dashboards.config.field_geometric_calculated_count_all==Navarra.dashboards.config.field_geometric_calculated_length_all){
          Navarra.geomaps.save_geometry_width_calculated_fields();
      }
    }
  }

  async function getArrayProvincias(geom){
    return await $.getJSON('https://apis.datos.gob.ar/georef/api/ubicacion?lat='+geom.latLng.lat+'&lon='+geom.latLng.lng, function(data,err) {
        // JSON result in `data` variable
    });
  }

  return {
    Script: Script,
    Calculate: Calculate
  }
}();
