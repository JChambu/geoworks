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
    console.log("Script a analizar")
    console.log(scriptTrue)
var is_multiple = $('#multiple_edit').hasClass("multiple_on");
 try{
    var hiddenTrue = JSON.parse(scriptTrue.hiddenTrue);
    var hiddenFalse = JSON.parse(scriptTrue.hiddenFalse);
    var requiredTrue = JSON.parse(scriptTrue.requiredTrue);
    var requiredFalse = JSON.parse(scriptTrue.requiredFalse);
    var readOnlyTrue = JSON.parse(scriptTrue.readOnlyTrue);
    var readOnlyFalse = JSON.parse(scriptTrue.readOnlyFalse);

    if(!is_multiple){
        for(x=0;x<hiddenTrue.length;x++){
            if(isparent){
                var texto_campo_id_script = "#field_id_"+hiddenTrue[x];
            } else{
                var texto_campo_id_script = "#fieldchildid\\|"+hiddenTrue[x]+"\\|"+field_id.split('|')[1];
            }
            if($(texto_campo_id_script).length>0){
                $(texto_campo_id_script).parent().closest('.row_field').addClass("d-none");
                $(texto_campo_id_script).parent().closest('.row_field').addClass("hidden_field");
            }
        }
        for(x=0;x<hiddenFalse.length;x++){
            if(isparent){
                var texto_campo_id_script = "#field_id_"+hiddenFalse[x];
            } else{
                var texto_campo_id_script = "#fieldchildid\\|"+hiddenFalse[x]+"\\|"+field_id.split('|')[1];
            }
            
            if($(texto_campo_id_script).length>0){
                if(initial){
                    $(texto_campo_id_script).parent().closest('.row_field').not('.empty_field').removeClass("d-none");
                    $(texto_campo_id_script).parent().closest('.row_field').removeClass("hidden_field");
                } else{
                    $(texto_campo_id_script).parent().closest('.row_field').removeClass("d-none");
                    $(texto_campo_id_script).parent().closest('.row_field').removeClass("hidden_field");
                }
            }
        }
        for(x=0;x<requiredTrue.length;x++){
            if(isparent){
                var texto_campo_id_script = "#field_id_"+requiredTrue[x];
            } else{
                var texto_campo_id_script = "#fieldchildid\\|"+requiredTrue[x]+"\\|"+field_id.split('|')[1];
            }
            if($(texto_campo_id_script).length>0){
                $(texto_campo_id_script).addClass("required_field");
            }
        }
        for(x=0;x<requiredFalse.length;x++){
            if(isparent){
                var texto_campo_id_script = "#field_id_"+requiredFalse[x];
            } else{
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
            } else{
                var texto_campo_id_script = "#fieldchildid\\|"+readOnlyTrue[x]+"\\|"+field_id.split('|')[1];
            }
            if($(texto_campo_id_script).length>0){
                $(texto_campo_id_script).addClass("readonly_field");
            }
        }
        for(x=0;x<readOnlyFalse.length;x++){
            if(isparent){
                var texto_campo_id_script = "#field_id_"+readOnlyFalse[x];
            } else{
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
            } else{
                $(texto_campo_id_script).addClass('readonly_field');
            }
        }
    }
  } catch(e){
    set_error_message("Error en la configuración del script del campo ID:"+field_id);
  }
}

function Calculate(calculated_field, field_type_id , field_id , value, edition_type, field_key, geom){
  var is_multiple = $('#multiple_edit').hasClass("multiple_on");
  try{ 
    var CalculateObj = JSON.parse(calculated_field);
    var field_type = field_type_id
    var id_field = field_id;
    var valueObj = $('#field_id_'+id_field).val();
    var CalculateObj_keys = Object.keys(CalculateObj);
    //Cálculos permitidos al crear y editar datos
    if(edition_type=="data_edition" || edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){
            if(CalculateObj_keys[k]=="calculation"){
                var calculoStringArray = CalculateObj.calculation.split("#");
                var calculoStringReplace="";
                for(ll=0;ll<calculoStringArray.length;ll++){
                    if(ll % 2 == 0){
                        calculoStringReplace+=calculoStringArray[ll];
                    } else{
                        var val = $('#field_id_'+calculoStringArray[ll]).val();
                        if(is_multiple){
                            $('#field_id_'+calculoStringArray[ll]).addClass('readonly_field');
                        }
                        if(val==""){val=0}
                        calculoStringReplace+=val;
                    }
                } 
                if(!is_multiple){
                    var resultado = eval(calculoStringReplace);
                    //redondea a dos decimales
                    resultado = Math.round(resultado * 100) / 100;
                    $('#field_id_'+field_id).val(resultado);
                }
            }
            if(CalculateObj_keys[k]=="semanaDesde"){
                if(!is_multiple){
                    var val_from = $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).val();
                    if(val_from!=""){
                        var dateObject = changeformatDate(val_from, 'day');
                        number_of_week = getWeekNumber(dateObject)[1]
                        $('#field_id_'+field_id).val(number_of_week);
                    }
                } else{
                    $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).addClass('readonly_field');
                }
            }
            if(CalculateObj_keys[k]=="localidad"){
                var id_Provincia = CalculateObj.localidad.split(',')[0];
                var id_Departamento = CalculateObj.localidad.split(',')[1];
                if(!is_multiple){
                    var provincia = $("#field_id_"+id_Provincia).val();
                    var departamento = $("#field_id_"+id_Departamento).val();
                    $.getJSON('https://apis.datos.gob.ar/georef/api/localidades?provincia=%22'+provincia+'%22&departamento=%22'+departamento+'%22&orden=nombre&aplanar=true&campos=estandar&max=5000', function(data,err) {
                        // JSON result in `data` variable
                        if(err=='success'){
                            $("#field_id_"+field_id).empty();
                            var found_option=false;
                            data.localidades.forEach(function(element) {
                                var new_option = document.createElement('OPTION');
                                  new_option.text=camelCase(element.nombre);
                                  new_option.value=camelCase(element.nombre);
                                  if(valueObj==null && value!=null){
                                    value_selected=value[0];
                                    }else{
                                        value_selected=valueObj;
                                    }
                                    if(value_selected!=null){
                                        if(value_selected.toUpperCase()==element.nombre.toUpperCase()){
                                            found_option=true;
                                            new_option.selected = true;
                                        }
                                    }    
                                document.getElementById("field_id_"+field_id).appendChild(new_option);
                            });
                            if(!found_option){document.getElementById("field_id_"+field_id).selectedIndex = -1;}
                            $("#field_id_"+field_id).multiselect('rebuild');
                            if(document.getElementById('field_id_'+field_id).classList.contains('info_input_disabled')){
                                $("#field_id_"+field_id).multiselect('disable');
                            }    
                        } else{
                            set_error_message("Error en la Api de Localizaciones");
                        }
                    });
                } else {
                    $("#field_id_"+id_Provincia).addClass('readonly_field')
                    $("#field_id_"+id_Departamento).addClass('readonly_field')
                }
            }
        }
    }
    //Cálculos permitidos al crear y editar geometrias
    if(edition_type=="geometry_edition" || edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){
            if(CalculateObj_keys[k]=="superficie"){
                area_calculated = Math.round(Navarra.geomaps.get_area()/10000*100)/100;
                    var data_calculated = {
                        id: geom.id,
                        field_key: field_key,
                        value_calculated: area_calculated
                    }
                    Navarra.dashboards.config.field_geometric_calculated.push(data_calculated);
                save_geometry_after_all_success_ajaxs();
            }
            if(CalculateObj_keys[k]=="provincia" ){
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
            if(CalculateObj_keys[k]=="municipio"){
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
            
        }   
    }
    // Cálculos permitidos al crear registro
    if(edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){
            if(CalculateObj_keys[k]=="sessionVariable"){

            }
            if(CalculateObj_keys[k]=="time"){

            }
            if(CalculateObj_keys[k]=="ID"){

            }
            if(CalculateObj_keys[k]=="semanaTomate"){

            }
            //Iscamen
            if(CalculateObj_keys[k]=="codigo_fenologia"){

            }
            if(CalculateObj_keys[k]=="temporada"){

            }
            if(CalculateObj_keys[k]=="semana"){

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

return {
    Script: Script,
    Calculate: Calculate
}
}();
