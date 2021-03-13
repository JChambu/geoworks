Navarra.namespace("calculated_and_script_fields");
Navarra.calculated_and_script_fields = function() {

function Script(data_script, field_type_id , field_id , value, initial) {
    var scriptString = data_script;
    var field_type = field_type_id
    var id_field = field_id;
    if(field_type==4){
        // si el campo tipo booleano tiene un Script y viene con valor nulo, se asigna valor = false por primera vez
       if(value==null && initial){$('#field_id_'+id_field).val("NO")}
        var scriptObj = JSON.parse(scriptString);
        if($('#field_id_'+id_field).val()=="SI"){
            var scriptTrue = scriptObj.true;
        } else{
            var scriptTrue = scriptObj.false;
        }
        script_ejecute(scriptTrue, initial);
}
 if((field_type==10 || field_type==2) && value!="" && value!=null){
    var scriptObjMulti = JSON.parse(scriptString);
    var arrayMultiOption_keys = Object.keys(scriptObjMulti);
    var valueObj = $('#field_id_'+id_field).val();
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
            script_ejecute(scriptTrue, initial);
        }
 }

}
function script_ejecute(scriptTrue, initial){
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
}
return {
    Script: Script
}
}();
