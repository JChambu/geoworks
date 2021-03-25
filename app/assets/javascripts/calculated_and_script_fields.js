Navarra.namespace("calculated_and_script_fields");
Navarra.calculated_and_script_fields = function() {

function Script(data_script, field_type_id , field_id , value, initial) {
    var scriptString = data_script;
    var field_type = field_type_id
    var id_field = field_id;
    if(field_type==4){
        // si el campo tipo booleano tiene un Script y viene con valor nulo, se asigna valor = false por primera vez
       if(value==null && initial){$('#field_id_'+id_field).val("false")}
        try{
            var scriptObj = JSON.parse(scriptString);
            if($('#field_id_'+id_field).val()=="true"){
                var scriptTrue = scriptObj.true;
            } else{
                var scriptTrue = scriptObj.false;
            }
            script_ejecute(scriptTrue, initial, field_id);
        } catch(e){
            set_error_message("Error en el atributo script del campo ID:"+field_id);
        }
        
}
 if((field_type==10 || field_type==2)){
    try{
        var scriptObjMulti = JSON.parse(scriptString);
        var arrayMultiOption_keys = Object.keys(scriptObjMulti);
        if($('#field_id_'+id_field).val()!=null){
            if(field_type == 2){
                var valueObj = [];
                valueObj.push($('#field_id_'+id_field).val());
            } else {
                var valueObj = $('#field_id_'+id_field).val();
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
                script_ejecute(scriptTrue, initial, field_id);
            }
        }
    } catch(e){
        set_error_message("Error en el atributo script del campo ID:"+field_id);
    }
 }

}
function script_ejecute(scriptTrue, initial, field_id){
 try{
    var hiddenTrue = JSON.parse(scriptTrue.hiddenTrue);
    var hiddenFalse = JSON.parse(scriptTrue.hiddenFalse);
    var requiredTrue = JSON.parse(scriptTrue.requiredTrue);
    var requiredFalse = JSON.parse(scriptTrue.requiredFalse);
    var readOnlyTrue = JSON.parse(scriptTrue.readOnlyTrue);
    var readOnlyFalse = JSON.parse(scriptTrue.readOnlyFalse);

    for(x=0;x<hiddenTrue.length;x++){
        if($('#field_id_'+hiddenTrue[x]).length>0){
            $('#field_id_'+hiddenTrue[x]).parent().closest('.row_field').addClass("d-none");
            $('#field_id_'+hiddenTrue[x]).parent().closest('.row_field').addClass("hidden_field");
        }
    }

    for(x=0;x<hiddenFalse.length;x++){
        if($('#field_id_'+hiddenFalse[x]).length>0){
            if(initial){
                $('#field_id_'+hiddenFalse[x]).parent().closest('.row_field').not('.empty_field').removeClass("d-none");
                $('#field_id_'+hiddenFalse[x]).parent().closest('.row_field').removeClass("hidden_field");
            } else{
                $('#field_id_'+hiddenFalse[x]).parent().closest('.row_field').removeClass("d-none");
                $('#field_id_'+hiddenFalse[x]).parent().closest('.row_field').removeClass("hidden_field");
            }
        }
    }
    for(x=0;x<requiredTrue.length;x++){
        if($('#field_id_'+requiredTrue[x]).length>0){
            $('#field_id_'+requiredTrue[x]).addClass("required_field");
        }
    }
    for(x=0;x<requiredFalse.length;x++){
        if($('#field_id_'+requiredFalse[x]).length>0){
            $('#field_id_'+requiredFalse[x]).removeClass("required_field");
            $('#field_id_'+requiredFalse[x]).parent().closest('div').css("border-bottom","none");
        }
    }
    for(x=0;x<readOnlyTrue.length;x++){
        if($('#field_id_'+readOnlyTrue[x]).length>0){
            $('#field_id_'+readOnlyTrue[x]).addClass("readonly_field");
        }
    }
    for(x=0;x<readOnlyFalse.length;x++){
        if($('#field_id_'+readOnlyFalse[x]).length>0){
            $('#field_id_'+readOnlyFalse[x]).removeClass("readonly_field");
        }
    }

    var scriptValue = scriptTrue.setValue;
    var arraykeys = Object.keys(scriptValue);
    for(x=0;x<arraykeys.length;x++){
        if($('#field_id_'+arraykeys[x]).length>0){
            $('#field_id_'+arraykeys[x]).val(scriptValue[arraykeys[x]]);
        }
    }
  } catch(e){
    set_error_message("Error en la configuración del script del campo ID:"+field_id);
  }
}

function Calculate(calculated_field, field_type_id , field_id , value, edition_type){
  try{ 
  calculated_field="ualquier dato" 
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
                        if(val==""){val=0}
                        calculoStringReplace+=val;
                    }
                } 
                console.log("String a calcular "+calculoStringReplace)
                var resultado = eval(calculoStringReplace);
                console.log("Resultado")
                console.log(resultado)
                $('#field_id_'+field_id).val(resultado);
            }
            if(CalculateObj_keys[k]=="semanaDesde"){
                var val_from = $('#field_id_'+CalculateObj[CalculateObj_keys[k]]).val();
                if(val_from!=""){
                    var dateObject = changeformatDate(val_from, 'day');
                    number_of_week = getWeekNumber(dateObject)[1]
                    $('#field_id_'+field_id).val(number_of_week);
                }
            }
        }
    }
    //Cálculos permitidos al crear y editar geometrias
    if(edition_type=="geometry_edition " || edition_type== "new_file"){
        for(k=0;k<CalculateObj_keys.length;k++){
            if(CalculateObj_keys[k]=="superficie"){

            }
            if(CalculateObj_keys[k]=="provincia"){

            }
            if(CalculateObj_keys[k]=="municipio"){

            }
            if(CalculateObj_keys[k]=="localidad"){

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

return {
    Script: Script,
    Calculate: Calculate
}
}();
