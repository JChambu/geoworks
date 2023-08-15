Navarra.namespace("pdf");
Navarra.pdf = function() {
var pdf_values_all = [];
var imgData_pdf;
var grouped_mail;
var logo_corp;
var cover_corp;
var user_name;
var footer ="";
var is_grouped = false;
let new_report_id;

function init_report_api(){
    is_grouped = false;
    // Obtiene todos los valores de la tabla
    pdf_values_all = [];
    var table_check = $('#table_hidden .custom-control-input').not('#table_select_all');
    table_check.each(function(index){
        index=index+1;
            if(this.checked){
                var pdf_values = new Object;
                pdf_values['id'] = this.id.split("check_select_")[1];
                pdf_values['properties'] = new Object;
                pdf_values['children'] = new Object;
                var row_selected = $('#table_hidden tr:nth-child('+index+') td').not('.custom_row_child').not('.child_celd').not('.footer_key');
                row_selected.each(function(index_column){
                    if(index_column>2 && (this.innerHTML!='' || ( $('#set_subfield_table').is(':checked') && $('#set_subfield_grouped').is(':checked') ) ) && !this.classList.contains('d-none') ){
                        var head_c = $('#tr_visible th:nth-child('+(index_column+1)+')').not('.subheader_column');
                        if(head_c.length>0){
                            var column_name = $('#tr_visible th:nth-child('+(index_column+1)+')').not('.subheader_column')[0].childNodes[1].childNodes[1];
                            var column_key = $('#tr_visible th:nth-child('+(index_column+1)+') input')[0];
                            pdf_values['properties'][column_key.value]= new Object;
                            // revisa si es capa y le elimina
                            if ($(this).find('div').length>0){
                                var multi_celd = "";
                                $(this).find('div').each(function(i){
                                    if(i != 0){
                                        multi_celd += " - ";
                                    }
                                    multi_celd += $(this).html();
                                });
                                pdf_values['properties'][column_key.value]['value'] = multi_celd;
                            } else {
                                pdf_values['properties'][column_key.value]['value'] = this.innerHTML;
                            }
                            pdf_values['properties'][column_key.value]['name'] = column_name.innerHTML;
                            pdf_values['properties'][column_key.value]['order'] = index_column;
                        }
                    }
                    });

                row_selected_child_date = $('.celdsubform_date_id'+pdf_values['id']);
                row_selected_child_date.each(function(index_child){
                        id_child_json =this.id.split('_')[2];
                        id_father_json =this.id.split('_')[0];
                        pdf_values['children'][id_child_json] =  new Object;
                        pdf_values['children'][id_child_json]['date'] =  this.innerHTML;
                        pdf_values['children'][id_child_json]['id_field'] = id_father_json;
                        pdf_values['children'][id_child_json]['name_field'] = $('#header_columntext_'+id_father_json).html();
                        pdf_values['children'][id_child_json]['properties'] =  new Object;
                });
                let ind = 0;
                Object.keys(pdf_values.children).forEach(function(key){
                    var row_selected_child = $("[id_child="+key+"]").not('.d-none').not('.just_date');
                    row_selected_child.each(function(index_child){
                        if(this.innerHTML!="" || $('#set_subfield_table').is(':checked')){
                            var id_father_field_json = this.id.split('_')[2];
                            id_father_json = pdf_values.children[key].id_field;
                            var column_child_name = $('#'+id_father_json+'_subheader_'+id_father_field_json ).html();
                            var column_child_unique_id = $('#'+id_father_json+'_subheader_'+id_father_field_json ).attr('unique_id');
                            pdf_values['children'][key]['properties'][id_father_field_json] =  new Object;
                            pdf_values['children'][key]['properties'][id_father_field_json]['value'] = this.innerHTML;
                            pdf_values['children'][key]['properties'][id_father_field_json]['name'] = column_child_name;
                            pdf_values['children'][key]['properties'][id_father_field_json]['unique_id'] = $('#'+id_father_json+'_subheader_'+id_father_field_json ).attr("unique_id");
                            pdf_values['children'][key]['properties'][id_father_field_json]['order'] = ind;
                            ind++;
                        }
                    });
                });
                pdf_values_all.push(pdf_values);
            }
    });
    Navarra.geomaps.asdasd();

    //Agrega footer
    c=0
    $('.footer_key').not('.d-none').each(function(){
        if($(this).html()!=''){
            if(c>0){footer+=" - "}
            footer += $(this).attr('name_function')+" "+$(this).html();
            c++;
        }
    });
    if(($('#set_subfield_grouped').is(':checked'))){
        pdf_values_all = order_pdf();
        is_grouped = true;
    }
    //agrega mapa
    Navarra.geomaps.asdasd();
    if(($('#set_map').is(':checked'))){
      console.log("entra a SET MAP");
      var mapContainer = document.getElementById('map');
      $('.leaflet-top').addClass('d-none');
      html2canvas(mapContainer, {
        useCORS: true,
      }).then(function(canvas) {
        console.log("CANVAS");
        console.log(canvas);
        console.log("Entra a condición THEN");
        imgData_pdf = canvas.toDataURL('image/png');
        $('.leaflet-top').removeClass('d-none');
        search_data_pdf();
      });

    } else {
      imgData_pdf = ""
      search_data_pdf();
    }
}

function search_data_pdf(is_chart){
    $.ajax({
    type: 'GET',
    url: '/customers/search_customer',
    datatype: 'JSON',
    data: {
        current_tenement: Navarra.dashboards.config.current_tenement,
        project_type_id: Navarra.dashboards.config.project_type_id
    },
    success: function(data) {
        if(data.logo!=null){
            logo_corp = data.logo;
        } else{
            logo_corp = '';
        }
        if(data.cover!=null){
            cover_corp = data.cover;
        } else{
            cover_corp = '';
        }
        user_name = data.username;
        if (is_chart){
            save_pdf_charts();
        } else {
            sarch_photos_report();
        }

    },
    error: function( jqXHR, textStatus, errorThrown ) {
    }
    });
}

function sarch_photos_report(){
    if(($('#set_photos').is(':checked'))){
        // busca fotos padres
        var ids = [];
        if(is_grouped){
            pdf_values_all.forEach(function(pdf_object){
                key = Object.keys(pdf_object);
                key.forEach(function(k){
                    obj = pdf_object[k];
                    keyb = Object.keys(obj);
                    if(keyb != undefined){
                        var fathers = obj[keyb]["fathers"];
                        ids.push(Object.keys(fathers));
                    }
                });

            });
        } else {
            pdf_values_all.forEach(function(pdf_object){
                ids.push(pdf_object['id']);
            });
        }

        $.ajax({
            type: 'GET',
            url: '/photos/get_photos',
            datatype: 'json',
            data: {
                ids: ids
            },
            success: function(data) {
                data.forEach(function(data_photos){
                data_photos.forEach(function(p){
                    Object.keys(p).forEach(function(k){
                        if(is_grouped){
                            pdf_values_all.forEach(function(pdf_object){
                                key = Object.keys(pdf_object);
                                obj = pdf_object[key];
                                if(obj != undefined){
                                    keyb = Object.keys(obj);
                                    var fathers = obj[keyb]["fathers"];
                                    ids = Object.keys(fathers);
                                    ids.forEach(function(id){
                                        if(id == k){
                                        if(obj[keyb]["fathers"][id]["photos"] ==  undefined){
                                            obj[keyb]["fathers"][id]["photos"] = [];
                                        }
                                        obj[keyb]["fathers"][id]["photos"].push(p[k]);
                                    }
                                    });
                                }
                            });
                        } else {
                            pdf_values_all.forEach(function(ob){
                                if(ob["id"] == k){
                                    if(ob["photos"] ==  undefined){
                                        ob["photos"] = [];
                                    }
                                    ob["photos"].push(p[k]);
                                }
                            });
                        }
                    });
                });
                });
                // Busca fotos de los hijos
                var ids = [];
                if(is_grouped){
                    pdf_values_all.forEach(function(pdf_object){
                        key = Object.keys(pdf_object);
                        key.forEach(function(k){
                            obj = pdf_object[k];
                            keyb = Object.keys(obj);
                            ids = obj[keyb]["ids"];
                        });
                        ids = ids.unique();
                    });

                } else {
                    pdf_values_all.forEach(function(pdf_object){
                        Object.keys(pdf_object['children']).forEach(function(i){
                            ids.push(i);
                        })
                    });
                }

                $.ajax({
                    type: 'GET',
                    url: '/photos_children/get_photos_children',
                    datatype: 'json',
                    data: {
                        ids: ids
                    },
                    success: function(data) {
                        var unique_photos = [];
                        data.forEach(function(data_photos){
                        data_photos.forEach(function(p){
                            Object.keys(p).forEach(function(k){
                                if(is_grouped) {
                                    pdf_values_all.forEach(function(pdf_object){
                                        key = Object.keys(pdf_object);
                                        obj = pdf_object[key];
                                        keyb = Object.keys(obj);
                                        ids_child = obj[keyb]["ids"];
                                        ids_child = ids_child.unique();
                                        ids_child.forEach(function(id){
                                            if(id == k){
                                                if(obj[keyb]["child"]["photos"] ==  undefined){
                                                    obj[keyb]["child"]["photos"] = [];
                                                }
                                                if(unique_photos.indexOf(p[k])<0){
                                                    obj[keyb]["child"]["photos"].push(p[k]);
                                                    unique_photos.push(p[k]);
                                                }
                                            }
                                        });
                                    });

                                } else {
                                    pdf_values_all.forEach(function(ob){
                                        Object.keys(ob['children']).forEach(function(i){
                                        if(i == k){
                                            if(ob["children"][i]["photos"] ==  undefined){
                                                ob["children"][i]["photos"] = [];
                                            }
                                        ob["children"][i]["photos"].push(p[k]);
                                        }
                                    });
                                });
                                }

                            });
                        });
                    });
                    save_pdf(pdf_values_all, is_grouped);
                } // termina success fotos hijos
            }); // termina ajax fotos hijos
        }// termina success fotos padres
        });//termina ajax fotos padres
    } else {
        save_pdf(pdf_values_all,is_grouped);
    }
}

function order_pdf(){
    //Ordenado por json único de hijos
    //Crea objeto ordenado
    pdf_values_all_sorted_array = [];
    var pdf_values_all_sorted = new Object;
    pdf_values_all.forEach(function(pdf_object){
        Object.keys(pdf_object['children']).forEach(function(child_key){
            Object.keys(pdf_object['children'][child_key]['properties']).forEach(function(key_c) {
                var unique_id = pdf_object['children'][child_key]['properties'][key_c]['unique_id'];
                var unique_id_value = JSON.stringify(pdf_object['children'][child_key]['properties']);
                var id_field_father = pdf_object['children'][child_key]['id_field'];
                if(pdf_values_all_sorted[unique_id_value] ==  undefined){
                    pdf_values_all_sorted[unique_id_value] = new Object;
                }
                if(pdf_values_all_sorted[unique_id_value][id_field_father] ==  undefined){
                    pdf_values_all_sorted[unique_id_value][id_field_father] = new Object;
                    pdf_values_all_sorted[unique_id_value][id_field_father]['fathers'] = new Object;
                    pdf_values_all_sorted[unique_id_value][id_field_father]['ids'] = [];
                }
                if(unique_id=="true"){
                    var unique_id_number = pdf_object['children'][child_key]['properties'][key_c]['value'];
                    pdf_values_all_sorted[unique_id_value][id_field_father]['unique_id'] = unique_id_number;
                }
                pdf_values_all_sorted[unique_id_value][id_field_father]['child'] = pdf_object['children'][child_key];
                pdf_values_all_sorted[unique_id_value][id_field_father]['ids'].push(child_key);
                pdf_values_all_sorted[unique_id_value][id_field_father]['fathers'][pdf_object['id']] = new Object;
                pdf_values_all_sorted[unique_id_value][id_field_father]['fathers'][pdf_object['id']]["props"] = pdf_object['properties'];
            });
        });
    });
    pdf_values_all_sorted_array.push(pdf_values_all_sorted)
    return pdf_values_all_sorted_array;
}


function init() {
    $('#mails_alert_button').removeClass('d-none');
    $('#send_alerts_button').removeClass('d-none');
    $('#save_pdf_button').addClass('d-none');
    $('#edit_pdf_button').addClass('d-none');
    $('.alert_header').removeClass('d-none');
    $('#message_type').html($('#alert_type').val());

    pdf_values_all = [];
    var table_check = $('#table_hidden .custom-control-input').not('#table_select_all');
    table_check.each(function(index){
        index=index+1;
            if(this.checked){
                var pdf_values = new Object;
                pdf_values['id'] = this.id.split("check_select_")[1];
                pdf_values['properties'] = new Object;
                pdf_values['children'] = new Object;
                var row_selected = $('#table_hidden tr:nth-child('+index+') td').not('.custom_row_child').not('.child_celd').not('.footer_key');
                row_selected.each(function(index_column){
                    if(index_column>2 && this.innerHTML!='' && !this.classList.contains('d-none')){
                        var column_name = $('#tr_visible th:nth-child('+(index_column+1)+')')[0].childNodes[1].childNodes[1];
                        var column_key = $('#tr_visible th:nth-child('+(index_column+1)+') input')[0];
                        pdf_values['properties'][column_key.value]= new Object;
                        pdf_values['properties'][column_key.value]['value'] = this.innerHTML;
                        pdf_values['properties'][column_key.value]['name'] = column_name.innerHTML;
                    }
                    });

                // selecciona hijos
                row_selected_child_date = $('.celdsubform_date_id'+pdf_values['id']);
                row_selected_child_date.each(function(index_child){
                        id_child_json =this.id.split('_')[2];
                        id_father_json =this.id.split('_')[0];
                        pdf_values['children'][id_child_json] =  new Object;
                        pdf_values['children'][id_child_json]['date'] =  this.innerHTML;
                        pdf_values['children'][id_child_json]['id_field'] = id_father_json;
                        pdf_values['children'][id_child_json]['name_field'] = $('#header_columntext_'+id_father_json).html();
                        pdf_values['children'][id_child_json]['properties'] =  new Object;
                });
                Object.keys(pdf_values.children).forEach(function(key){
                    var row_selected_child = $("[id_child="+key+"]").not('.d-none').not('.just_date');
                    row_selected_child.each(function(index_child){
                        if(this.innerHTML!=""){
                            var id_father_field_json = this.id.split('_')[2];
                            id_father_json = pdf_values.children[key].id_field;
                            var column_child_name = $('#'+id_father_json+'_subheader_'+id_father_field_json ).html();
                            var column_child_unique_id = $('#'+id_father_json+'_subheader_'+id_father_field_json ).attr('unique_id');
                            pdf_values['children'][key]['properties'][id_father_field_json] =  new Object;
                            pdf_values['children'][key]['properties'][id_father_field_json]['value'] = this.innerHTML;
                            pdf_values['children'][key]['properties'][id_father_field_json]['name'] = column_child_name;
                            pdf_values['children'][key]['properties'][id_father_field_json]['unique_id'] = $('#'+id_father_json+'_subheader_'+id_father_field_json ).attr("unique_id");
                        }
                    });
                });
                pdf_values_all.push(pdf_values);
            }
    });
    $('#dropdown_alert_mails').empty();
    create_alert_view();
}

function create_alert_view(){
    $('#pdf_body').empty();
    get_logo();
    var alert_text = $('#alert_text').val();
    pdf_content = '';
    // convierte el text area en múltiples elementos <p> para mejor visualización en emails
    numberOfLineBreaks = (alert_text.split(/\n/g)).forEach(function(line){
        pdf_content += "<p class='text_alert_preview' style = 'margin: 0px 5%;text-align:center;font-size:16px;line-height:18px' >"+line+"</p>" ;
    });
    $('#pdf_body').append(pdf_content);

    if($('#alert_group').val()==""){
        // Ordenado por geometría;
        pdf_values_all.forEach(function(pdf_object, index_pdf){
            grouped_mail = [];
            create_htm_pdf(pdf_object,index_pdf);
            if(grouped_mail.length>0){
                var option_mail = "<a onclick='Navarra.pdf.change_alert_mail("+index_pdf+")' class='alert_to dropdown-item text-left custom_cursor'>"+grouped_mail.unique()+"</a>"
                $('#dropdown_alert_mails').append(option_mail);
            }
        });
    }
     if($('#alert_group').val()=="suform_grouped"){
        //Ordenado por json único de hijos
        //Crea objeto ordenado
        var text_dnone = '';
        var alert_mail_key = $('#alert_mail').val();
        if($('#alert_mail').val()!=null){
            if($('#alert_mail').val().split('|').length==2){
                //viene de capa superiores
                var alert_mail_key = document.getElementById('alert_mail').options[document.getElementById('alert_mail').selectedIndex].getAttribute('id_field_layer')
            }
        }
        var pdf_values_all_sorted = new Object;
        pdf_values_all.forEach(function(pdf_object){
            Object.keys(pdf_object['children']).forEach(function(child_key){
                Object.keys(pdf_object['children'][child_key]['properties']).forEach(function(key_c) {
                    var unique_id = pdf_object['children'][child_key]['properties'][key_c]['unique_id'];
                    var unique_id_value = JSON.stringify(pdf_object['children'][child_key]['properties']);
                    var id_field_father = pdf_object['children'][child_key]['id_field'];
                    if(pdf_values_all_sorted[unique_id_value] ==  undefined){
                        pdf_values_all_sorted[unique_id_value] = new Object;
                    }
                    if(pdf_values_all_sorted[unique_id_value][id_field_father] ==  undefined){
                        pdf_values_all_sorted[unique_id_value][id_field_father] = new Object;
                        pdf_values_all_sorted[unique_id_value][id_field_father]['fathers'] = new Object;
                        pdf_values_all_sorted[unique_id_value][id_field_father]['ids'] = [];
                    }
                    if(unique_id=="true"){
                        var unique_id_number = pdf_object['children'][child_key]['properties'][key_c]['value'];
                        pdf_values_all_sorted[unique_id_value][id_field_father]['unique_id'] = unique_id_number;
                    }
                    pdf_values_all_sorted[unique_id_value][id_field_father]['child'] = pdf_object['children'][child_key];
                    pdf_values_all_sorted[unique_id_value][id_field_father]['ids'].push(child_key);
                    pdf_values_all_sorted[unique_id_value][id_field_father]['fathers'][pdf_object['id']] = pdf_object['properties'];
                });
            });
        });
        //Dibuja objeto ordenado
        var text_dnone = '';
        var alert_mail_key = $('#alert_mail').val();
        if($('#alert_mail').val()!=null){
            if($('#alert_mail').val().split('|').length==2){
                //viene de capa superiores
                var alert_mail_key = document.getElementById('alert_mail').options[document.getElementById('alert_mail').selectedIndex].getAttribute('id_field_layer');
            }
        }
        var class_div = "";
        var class_title = "style='font-size:1.3vh'";
        var class_p = "style='font-size:1vh'";
        var class_div_photos = "";
        var class_div_child = "";
        var class_title_child = "style='font-size:1.1vh'";
        var class_p_child = "style='font-size:1.1vh'";
        class_div = "style='width:100%;display:block'";
        class_title = "style='font-size: 14px; font-weight:bold;line-height:16px;color:#666; margin: 30px 0px 10px 0px'";
        class_p = "style='font-size:12px;margin:0px;line-height:14px;color:#666'";
        class_div_photos = "style='width:100%'";
        class_div_child = "style='width:100%; display:block; padding-left:10px'";
        class_title_child = "style='font-size: 12px; font-weight:bold;line-height:14px;color:#666; margin: 30px 0px 10px 0px'";
        class_p_child = "style='font-size: 12px;line-height:14px; margin: 0px;color:#666'";

        Object.keys(pdf_values_all_sorted).forEach(function(key_unique, index){
            Object.keys(pdf_values_all_sorted[key_unique]).forEach(function(id_field_father, index_father_field){
                var pdf_content = "";
                if(index>0){text_dnone=' invisible '}
                pdf_content += "<div class='mt-3 "+text_dnone+" alert_mail_conteiner alert_mail_conteiner"+index+"'>";
                grouped_mail = [];
                pdf_content += "<div class = 'div_pdf div_pdf_child"+index+"_"+index_father_field+"' "+class_div+">";
                pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' "+class_title+">"+pdf_values_all_sorted[key_unique][id_field_father]['child']['name_field']+"</p>";
                if(pdf_values_all_sorted[key_unique][id_field_father]['unique_id']!=undefined){
                    pdf_content += "<p class='title_pdf mt-1 mb-0 element_pdf' "+class_title+">"+pdf_values_all_sorted[key_unique][id_field_father]['unique_id']+"</p>";
                }
                pdf_content += "<p class='title_pdf mt-1 mb-1 element_pdf' "+class_title+">"+pdf_values_all_sorted[key_unique][id_field_father]['child']['date']+"</p>";
                Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['child']['properties']).forEach(function(key) {
                    pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' "+class_p+" >"+pdf_values_all_sorted[key_unique][id_field_father]['child']['properties'][key]['name']+": "+pdf_values_all_sorted[key_unique][id_field_father]['child']['properties'][key]['value']+"</p></div>";
                });
                pdf_content += "</div>"
                pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos_child"+index+"_"+index_father_field+"' "+class_div_photos+"></div>"
                pdf_content += "</div>";
                $('#pdf_body').append(pdf_content);
                //cambiar modelo para que traiga fotos de un array de ids
                get_photo(pdf_values_all_sorted[key_unique][id_field_father]['ids'].unique()[0],true,index+"_"+index_father_field,true,true);
            // Campos padres
                Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['fathers']).forEach(function(father_key){
                    var pdf_content = "<div class = '"+text_dnone+" div_pdf_child_container div_pdf_child_container"+index+"'>"
                    pdf_content += "<div class = 'div_pdf div_pdf_child div_pdf"+father_key+"_"+index+"_"+index_father_field+"' "+class_div_child+">";
                    pdf_content += "<p class='title_pdf mt-3 mb-1 element_pdf' "+class_title_child+">"+Navarra.dashboards.config.name_project+"</p>";
                    Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key]).forEach(function(key_f) {
                        pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' "+class_p_child+" >"+pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['name']+": "+pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['value']+"</p></div>";
                        if(key_f == alert_mail_key){
                            grouped_mail.push(pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['value']);
                        }
                    });
                pdf_content += "</div>";
                pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+father_key+"_"+index+"_"+index_father_field+"' "+class_div_photos+"></div>"
                pdf_content += "</div>";
                $('#pdf_body').append(pdf_content);
                get_photo(father_key,false,father_key+"_"+index+"_"+index_father_field,true, true);
                });
                if(grouped_mail.length>0){
                    var option_mail = "<a onclick='Navarra.pdf.change_alert_mail("+index+")' class='alert_to dropdown-item text-left custom_cursor'>"+grouped_mail.unique()+"</a>"
                    $('#dropdown_alert_mails').append(option_mail);
                }
            });
        });
    }
    if($('#alert_group').val()!="suform_grouped" && $('#alert_group').val()!=""){
        //Ordenado por campo padre o capa superior
        //Crea objeto ordenado
        var pdf_values_all_sorted = new Object;
        pdf_values_all.forEach(function(pdf_object){
            var grouped_key = $('#alert_group').val();
            var grouped_key_value = pdf_object['properties'][grouped_key]['value']
            if(pdf_values_all_sorted[grouped_key_value] ==  undefined){
                    pdf_values_all_sorted[grouped_key_value] = new Object;
                    pdf_values_all_sorted[grouped_key_value]['objects'] = [];
                }
                pdf_values_all_sorted[grouped_key_value]['objects'].push(pdf_object);
        });
        //Dibuja objeto ordenado
        Object.keys(pdf_values_all_sorted).forEach(function(object_grouped, index_sorted){
            grouped_mail = [];
            pdf_values_all_sorted[object_grouped]['objects'].forEach(function(pdf_object, index){
                create_htm_pdf(pdf_object,index_sorted);
            });
            if(grouped_mail.length>0){
                var option_mail = "<a onclick='Navarra.pdf.change_alert_mail("+index_sorted+")' class='alert_to dropdown-item text-left custom_cursor'>"+grouped_mail.unique()+"</a>"
                $('#dropdown_alert_mails').append(option_mail);
        }
        });
    }
    // agrega totales, mínimo, máximos y promedios. En alertas, solo los agrega si hay un único destinatario
    if($('.alert_to').length==1 ){
        $('.footer_key').not('.d-none').each(function(){
            if($(this).html()!=''){
             $('#pdf_body').append("<p style='font-size:1.5vh' class='title_pdf mt-3 mb-0 element_pdf' "+class_title+">"+$(this).attr('name_function')+" "+$(this).html()+"</p>");
            }
        });
    }
}

function create_htm_pdf(pdf_object,index_pdf){
    var text_dnone = '';
    var alert_mail_key = $('#alert_mail').val();
    if($('#alert_mail').val()!=null){
        if($('#alert_mail').val().split('|').length==2){
            //viene de capa superiores
            var alert_mail_key = document.getElementById('alert_mail').options[document.getElementById('alert_mail').selectedIndex].getAttribute('id_field_layer')
        }
    }
    var pdf_content = "";
    var class_div = "";
    var class_title = "style='font-size:1.3vh'";
    var class_p = "style='font-size:1vh'";
    var class_div_photos = "";
    var class_div_child = "";
    var class_title_child = "style='font-size:1.1vh'";
    var class_p_child = "style='font-size:1.1vh'";
    if(index_pdf>0){text_dnone=' invisible '}
    pdf_content += "<div class='mt-3 "+text_dnone+" alert_mail_conteiner alert_mail_conteiner"+index_pdf+"'>";
    class_div = "style='width:100%;display:block'";
    class_title = "style='font-size: 14px; font-weight:bold;line-height:16px;color:#666; margin: 30px 0px 10px 0px'";
    class_p = "style='font-size:12px;margin:0px;line-height:14px;color:#666'";
    class_div_photos = "style='width:100%'";
    class_div_child = "style='width:100%; display:block; padding-left:10px'";
    class_title_child = "style='font-size: 12px; font-weight:bold;line-height:14px;color:#666; margin: 30px 0px 10px 0px'";
    class_p_child = "style='font-size: 12px;line-height:14px; margin:0px;color:#666'";

    pdf_content += "<div class = 'div_pdf div_pdf"+pdf_object['id']+"' "+class_div+">";
    pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' "+class_title+">"+Navarra.dashboards.config.name_project+"</p>";
    Object.keys(pdf_object['properties']).forEach(function(key) {
        pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' "+class_p+" >"+pdf_object['properties'][key]['name']+": "+pdf_object['properties'][key]['value']+"</p></div>";
        if(key == alert_mail_key){
            grouped_mail.push(pdf_object['properties'][key]['value']);
        }
    });
    pdf_content += "</div>"
    pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+pdf_object['id']+"' "+class_div_photos+"></div>"
    pdf_content += "</div>"

    $('#pdf_body').append(pdf_content);
    get_photo(pdf_object['id'],false,pdf_object['id'],false,true);
    // Campos hijos
    Object.keys(pdf_object['children']).forEach(function(child_key){
        var pdf_content = "<div class = '"+text_dnone+" div_pdf_child_container div_pdf_child_container"+index_pdf+"'>"
        pdf_content += "<div class = 'div_pdf div_pdf_child div_pdf_child"+child_key+"' "+class_div_child+">";
        pdf_content += "<p class='title_pdf mt-3 mb-1 element_pdf' "+class_title_child+">"+pdf_object['children'][child_key]['name_field']+": "+pdf_object['children'][child_key]['date']+"</p>";
        Object.keys(pdf_object['children'][child_key]['properties']).forEach(function(key_c) {
            pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' "+class_p_child+" >"+pdf_object['children'][child_key]['properties'][key_c]['name']+": "+pdf_object['children'][child_key]['properties'][key_c]['value']+"</p></div>";
        });
        pdf_content += "</div>"
        pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos_child"+child_key+"' "+class_div_photos+"></div>"
        pdf_content += "</div>"
        $('#pdf_body').append(pdf_content);
        get_photo(child_key,true,child_key,false,true);
    });

}

function get_photo(app_id, ischild, id_container,is_grouped, is_alert){
    if(is_grouped && ischild){
        var height_max = 100
    } else{
        var height_max = 55
    }
    if(ischild){
        var container = 'div_pdf_child';
        var container_photos = 'div_pdf_photos_child';
        var url_get = '/photos_children/show_photos_children';
        var data_get = {
            project_data_child_id: app_id,
        }
    } else{
        var container = 'div_pdf';
        var container_photos = 'div_pdf_photos';
        var url_get = '/photos/show_photos';
        var data_get = {
            project_id: app_id,
        }
    }
   $.ajax({
        type: 'GET',
        url: url_get,
        datatype: 'json',
        data: data_get,
        success: function(data) {
          if(is_alert){
            var img_pdf = "<div style='margin-top:20px'>";
            data.forEach(function(photo){
                var img_base64 = btoa(atob(photo.image));
                img_pdf += "<img alt='imagen' style='width: 40%; margin:2px 30%;' src= 'data:image/png;base64,"+img_base64+"' />"
                });
                img_pdf +="</div>"
                $('.'+container_photos+id_container).removeClass('d-none');
                $('.'+container_photos+id_container).append(img_pdf)
          } else {
            if(data.length==0){
                if($('.'+container+id_container).outerHeight()>height_max){
                    $('.'+container+id_container).removeClass('div_pdf');
                    $('.'+container+id_container).addClass('div_pdf_expanded');
                    var x_screen_half = tamVentana()[1]*0.64*0.44;
                    $('.'+container+id_container+' div').each(function(){
                        if($(this).find('p').outerWidth()<x_screen_half){
                            $(this).addClass('d-inline-flex');
                            $(this).addClass('sub_div_pdf_expanded');
                            $(this).removeClass('d-flex');
                        }
                    });
                } else{
                    $('.'+container+id_container).addClass('w-100');
                }
            } else{
                var img_pdf = "<div class='pt-4'>";
                var height_container = $('.'+container+id_container).outerHeight() - 30;
                var width_container = $('.'+container+id_container).outerWidth()
                if(height_container*data.length + 4*data.length > width_container){
                    height_container = ($('.'+container+id_container).outerWidth() / data.length) - 4;
                }
                if(height_container<40){height_container=40}
                data.forEach(function(photo){
                    img_pdf += "<img style='height: "+height_container+"px' src= 'data:image/png;base64,"+photo.image+"' class='img_pdf element_pdf'/>"
                });
                img_pdf +="</div>"
                $('.'+container_photos+id_container).removeClass('d-none');
                $('.'+container_photos+id_container).append(img_pdf)
            }
          }
        }
    });
}


function get_logo(){
    var logo_src = document.getElementById('img_logo_gw');
    const dataUrl = getDataUrl(logo_src);
    $('#logo_gw2').attr("src",dataUrl);
    $.ajax({
        type: 'GET',
        url: '/customers/search_customer',
        datatype: 'JSON',
        data: {
            current_tenement: Navarra.dashboards.config.current_tenement
        },
        success: function(data) {
            if(data.logo!=null){
                $('.logo_coorp_pdf_src').attr("src",'data:image/png;base64,'+data.logo);
                logo_corp = data.logo;
            } else{
                $('.logo_coorp_pdf_src').css('visibility','hidden');
                $('.logo_coorp_pdf_src').removeClass('element_pdf');
                logo_corp = '';
            }

            var currentdate = new Date();
            var today = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() ;
            $('.pdf_created').html(data.username+" - "+today);
        },
        error: function( jqXHR, textStatus, errorThrown ) {
        }
    });
}

function change_alert_mail(index){
    //necesitan inicialmente estar invisibles para cargar correctamente el tamaño de las fotos
    $('.alert_mail_conteiner').removeClass('invisible');
    $('.div_pdf_child_container').removeClass('invisible');
    $('.alert_mail_conteiner').addClass('d-none');
    $('.div_pdf_child_container').addClass('d-none');
    $('.div_pdf_child_container'+index).removeClass('d-none');
    $('.alert_mail_conteiner'+index).removeClass('d-none');
}


function save_pdf(pdf_values_all, is_grouped){
    $('#qr_modal_body').empty();
    $('#text_toast').html("Generando PDF. En breve se descargará su archivo.");
    $('#toast').toast('show');
    template_type = $('#pdf_type').val();
    data_report ={}
    data_report["data"] = pdf_values_all;
    data_report["name"] = Navarra.dashboards.config.name_project;
    data_report["user"] = user_name;
    data_report["map"] = imgData_pdf;
    data_report["logo"] = logo_corp;
    data_report["totals"] = footer;
    if($('#set_subfield_table').is(':checked')){
        data_report["child_table"] = 'true' ;
    }
    if($('#set_subfield_grouped').is(':checked')){
        data_report["grouped"] = 'true' ;
    }

    data_report[template_type] = true;
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var actual_date = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + " " + (d.getHours() <10 ? '0' : '') + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '')  +d.getMinutes();
    data_report["date"] = actual_date
    var hash_pdf = {}
    if (is_grouped) {
        hash_pdf["name"] = "group_report";
    } else {
        hash_pdf["name"] = "example_report";
    }
    var data = {}
    data["template"] = hash_pdf;
    data["data"] = data_report;
    data["file"] = "reporte.pdf";

    console.log("Data")
    console.log(data)

    if(($('#set_qr').is(':checked'))){
        //guarda datos si se solicita QR
        $.ajax({
            type: 'POST',
            url: '/reports/save_data_report',
            datatype: 'application/json',
            data: data,
            success: function(response) {
                new_report_id = response.report_id;
                console.log("Reporte id "+new_report_id);
                const rdm1 = Math.floor(1000 + Math.random() * 9000);
                const rdm2 = Math.floor(1000 + Math.random() * 9000);
                const protocol = window.location.protocol;
                const path_qr = window.location.host;
                var urlQR = protocol+"//"+path_qr+"/reports/get_reports?template_id="+rdm1+""+new_report_id+""+rdm2;
                var nuevo = "<div><div id = barcode></div></div>"
                $('#qr_modal_body').append(nuevo);
                $('#qr_modal_body').append(`<p id="copy_clipboard" class="mt-3 text-dark d-inline">${urlQR}</p>`);
                $('#qr_modal_body').append(`<i class="d-inline fas fa-copy ml-4 text-dark custom_cursor" onclick="Navarra.pdf.copy_clipboard()"></i>`);
                jQuery("#barcode").qrcode({
                render:"canvas",
                width: 200,
                height: 200,
                text: urlQR
                });
                $('#qr-modal').modal('show');
                data["data"]["qr"] = $('#barcode canvas:nth-child(1)')[0].toDataURL();
                final_pdf(data);
                console.log("Data final")
                console.log(data);
            }
        });
    } else {
        final_pdf(data);
    }
}

function final_pdf(data){
    $.ajax({
      type: 'POST',
      url: '/dashboards/send_report',
      xhrFields: {
            responseType: 'blob'
        },
      datatype: 'application/json',
      data: data,
      success: function(data) {
        //Convert the Byte Data to BLOB object.
        var blob = new Blob([data], { type: "application/octetstream" });
        var url = window.URL || window.webkitURL;
        link = url.createObjectURL(blob);
        var a = $("<a />");
        a.attr("download", "reporte.pdf");
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);
      }
  });
}

function init_pdf_charts(){
    search_data_pdf(true);
}

function save_pdf_charts(){
    $('#text_toast').html("Generando PDF. En breve se descargará su archivo.");
    $('#toast').toast('show');
    charts_for_pdf = [];
    $('.chart_container').each(function(){
        if(!$(this).hasClass('d-none')){
            var new_chart = {}
            var id_chart = $(this).attr('id').split('chart_container')[1];
            var chart_title = $('#text_chart'+id_chart).html();
            var chart_canvas = document.getElementById('canvas'+id_chart);
            var pngUrl = chart_canvas.toDataURL();
            new_chart["chart_title"] = chart_title;
            new_chart["chart"] = pngUrl;
            charts_for_pdf.push(new_chart)
        }
    });
    template_type = "charts_report";
    data_report ={}
    data_report["data"] = charts_for_pdf;
    data_report["name"] = Navarra.dashboards.config.name_project;
    data_report["user"] = user_name;
    data_report["map"] = imgData_pdf;
    data_report["logo"] = logo_corp;
    if($('#sidebar_all').hasClass('charts-container_expanded')){
        data_report["expanded"] = true;
    }
    data_report[template_type] = true;
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var actual_date = d.getFullYear() + '/' + (month<10 ? '0' : '') + month + '/' + (day<10 ? '0' : '') + day + " " + (d.getHours() <10 ? '0' : '') + d.getHours() + ":" + (d.getMinutes() <10 ? '0' : '')  +d.getMinutes();
    data_report["date"] = actual_date
    var hash_pdf = {}
    hash_pdf["name"] = "example_report";
    var data = {}
    data["template"] = hash_pdf;
    data["data"] = data_report;
    data["file"] = "reporte.pdf";
    $.ajax({
      type: 'POST',
      url: '/dashboards/send_report',
      xhrFields: {
            responseType: 'blob'
        },
      datatype: 'application/json',
      data: data,
      success: function(data) {
        //Convert the Byte Data to BLOB object.
        var blob = new Blob([data], { type: "application/octetstream" });
        var url = window.URL || window.webkitURL;
        link = url.createObjectURL(blob);
        var a = $("<a />");
        a.attr("download", "reporte.pdf");
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);
      }
  });
}


function send_alerts(){
    $('.alert_to').each(function(){
        $(this).click();
        var alert_to = $(this).html();
        var alert_mail_content = '';
        var header_content = $('#header_alert_text').html();
        var img_attach_count = 0;
        var img_attach_src = [];
        var alert_mail_content = [];
        $('.text_alert_preview').each(function(){
            alert_mail_content.push($(this)[0].outerHTML);
        });
        $('.alert_mail_conteiner , .div_pdf_child_container').not('.invisible').not('.d-none').children().each(function(){
            if($(this).hasClass('div_pdf_photos')){
                var app_img_attach = "app_img_attach"
                $(this).find('img').each(function(){
                    img_attach_count ++;
                    app_img_attach +=img_attach_count+",";
                    img_attach_src.push($(this).attr('src').split('data:image/png;base64,')[1]);
                })
                alert_mail_content.push(app_img_attach)
            } else{
                alert_mail_content.push($(this)[0].outerHTML)
            }
        });
        var plain_content = $('#alert_text').val();
        $('#pdf-modal').modal('hide');
        $('.table_data_container').removeClass('d-none');
        $('#text_toast').html("Enviando ...");
        $('#toast').toast('show');
        $.ajax({
            url: '/dashboards/send_alerts',
            type: 'POST',
            data: {
                to: alert_to,
                name_corp: Navarra.dashboards.config.current_tenement,
                logo_corp: logo_corp,
                header_content: header_content,
                html_content: alert_mail_content,
                img_attach_src: img_attach_src,
                plain_content: plain_content
            }
        });
    })
}

function close_pdf(){
    $('#pdf-modal').modal('hide');
    $('.table_data_container').removeClass('d-none');
}

function copy_clipboard(){
    var copyText = document.getElementById("copy_clipboard").innerHTML;
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(copyText);
        $('#text_toast').html("Se ha copiado la url");
        $('#toast').toast('show');
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = copyText;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
            $('#text_toast').html("Se ha copiado la url");
            $('#toast').toast('show');
        });
    }
}

function download_qr(){
    img = $('#barcode canvas:nth-child(1)')[0];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 260;
    canvas.height = 260;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 30, 30 , 200, 200);
    link = canvas.toDataURL()
    var a = $("<a />");
    a.attr("download", "qr-"+new_report_id+".png");
    a.attr("href", link);
    $("body").append(a);
    a[0].click();
    $("body").remove(a);
}

function tamVentana() {
  var tam = [0, 0];
  if (typeof window.innerWidth != 'undefined')
  {
    tam = [window.innerWidth,window.innerHeight];
  }
  else if (typeof document.documentElement != 'undefined'
      && typeof document.documentElement.clientWidth !=
      'undefined' && document.documentElement.clientWidth != 0)
  {
    tam = [
        document.documentElement.clientWidth,
        document.documentElement.clientHeight
    ];
  }
  else   {
    tam = [
        document.getElementsByTagName('body')[0].clientWidth,
        document.getElementsByTagName('body')[0].clientHeight
    ];
  }
  return tam;
}

function getDataUrl(img) {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');
   canvas.width = img.width;
   canvas.height = img.height;
   ctx.drawImage(img, 0, 0 , img.width, img.height);
   return canvas.toDataURL('image/png');
}

return {
    init: init,
    init_report_api: init_report_api,
    save_pdf: save_pdf,
    change_alert_mail: change_alert_mail,
    send_alerts: send_alerts,
    close_pdf: close_pdf,
    save_pdf_charts: save_pdf_charts,
    init_pdf_charts: init_pdf_charts,
    copy_clipboard: copy_clipboard,
    download_qr: download_qr
}
}();
