Navarra.namespace("pdf");
Navarra.pdf = function() {
var pdf_values_all = [];
var imgData_pdf;
var grouped_mail;

function init(is_alert) {
    if(is_alert){
        $('#mails_alert_button').removeClass('d-none');
        $('#send_alerts_button').removeClass('d-none');
        $('#save_pdf_button').addClass('d-none');
        $('#edit_pdf_button').addClass('d-none');
        $('.pdf_header').addClass('d-none');
        $('.alert_header').removeClass('d-none');
    } else {
        $('#mails_alert_button').addClass('d-none');
        $('#send_alerts_button').addClass('d-none');
        $('#save_pdf_button').removeClass('d-none');
        $('#edit_pdf_button').removeClass('d-none');
        $('.pdf_header').removeClass('d-none');
        $('.alert_header').addClass('d-none');
    }
    pdf_values_all = [];
    var table_check = $('#table_visible .custom-control-input')
    table_check.each(function(index){
        if(this.id!='table_select_all_hidden'){
            if(this.checked){
                var pdf_values = new Object;
                pdf_values['id'] = this.id.split("check_select_")[1];
                pdf_values['properties'] = new Object;
                pdf_values['children'] = new Object;
                var row_selected = $('#table_visible tr:nth-child('+index+') td').not('.custom_row_child').not('.child_celd');
                row_selected.each(function(index_column){
                    if(index_column>2 && this.innerHTML!='' && !this.classList.contains('d-none')){
                        var column_name = $('#tr_visible th:nth-child('+(index_column+1)+')')[0].childNodes[1].childNodes[1];
                        var column_key = $('#tr_visible th:nth-child('+(index_column+1)+') input')[0];
                        pdf_values['properties'][column_key.value]= new Object;
                        pdf_values['properties'][column_key.value]['value'] = this.innerHTML;
                        pdf_values['properties'][column_key.value]['name'] = column_name.innerHTML;
                    }
                    });
                row_selected_child = $('#table_visible tr:nth-child('+index+') .custom_row_child tr');
                    row_selected_child.each(function(){
                        var field_child = $(this).find('td');
                        var id_child_json = 0;
                        var id_father_json = 0;
                        field_child.each(function(index_child){
                             if(index_child>=1 && this.innerHTML!='' && !this.classList.contains('d-none')){
                                if(index_child==1){
                                    id_child_json =this.id.split('_')[2];
                                    id_father_json =this.id.split('_')[0];
                                    pdf_values['children'][id_child_json] =  new Object;
                                    pdf_values['children'][id_child_json]['date'] =  this.innerHTML;
                                    pdf_values['children'][id_child_json]['id_field'] = id_father_json;
                                    pdf_values['children'][id_child_json]['name_field'] = $('#header_columntext_'+id_father_json).html();
                                    pdf_values['children'][id_child_json]['properties'] =  new Object;
                                } else{
                                    var id_father_field_json = this.id.split('_')[2];
                                    var column_child_name = $('#'+id_father_json+'_subheader_'+id_father_field_json ).html();
                                    var column_child_unique_id = $('#'+id_father_json+'_subheader_'+id_father_field_json ).attr('unique_id');
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json] =  new Object;
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json]['value'] = this.innerHTML;
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json]['name'] = column_child_name;
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json]['unique_id'] = $('#'+id_father_json+'_subheader_'+id_father_field_json ).attr("unique_id");
                                }
                             }
                        })
                });
                pdf_values_all.push(pdf_values);
            }
        }
    });
    console.log("Array de datos")
    console.log(pdf_values_all)
    $('#dropdown_alert_mails').empty();
    create_pdf_view(is_alert);
}

function create_pdf_view(is_alert){
    $('#pdf_body').empty();
    get_logo();
    var alert_text = $('#alert_text').val();
    if(is_alert){
        pdf_content = '';
        // convierte el text area en múltiples elementos <p> para mejor visualización en emails
        numberOfLineBreaks = (alert_text.split(/\n/g)).forEach(function(line){
            pdf_content += "<p style = 'margin: 0px 5%;text-align:center;font-size:16px;line-height:18px' >"+line+"</p>" ;
        });
        $('#pdf_body').append(pdf_content);
    }
    if((!$('#set_subfield_grouped').is(':checked') && !is_alert) || (is_alert && $('#alert_group').val()=="")){
        // Ordenado por geometría;
        pdf_values_all.forEach(function(pdf_object, index_pdf){
            grouped_mail = [];
            create_htm_pdf(pdf_object,index_pdf, is_alert);
            if(is_alert && grouped_mail.length>0){
                var option_mail = "<a onclick='Navarra.pdf.change_alert_mail("+index_pdf+")' class='alert_to dropdown-item text-left custom_cursor'>"+grouped_mail.unique()+"</a>"
                $('#dropdown_alert_mails').append(option_mail);
            }
        });
    }
     if(($('#set_subfield_grouped').is(':checked') && !is_alert) || (is_alert && $('#alert_group').val()=="suform_grouped")){
        //Ordenado por json único de hijos
        //Crea objeto ordenado
        var text_dnone = '';
        var alert_mail_key = $('#alert_mail').val();
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
        console.log("Objeto ordenado")
        console.log(pdf_values_all_sorted)
        //Dibuja objeto ordenado
        var text_dnone = '';
        var alert_mail_key = $('#alert_mail').val();
        var class_div = "";
        var class_title = "style='font-size:1.3vh'";
        var class_p = "style='font-size:1vh'";
        var class_div_photos = "";
        var class_div_child = "";
        var class_title_child = "style='font-size:1.1vh'";
        var class_p_child = "style='font-size:1.1vh'";
        if(is_alert){
            class_div = "style='width:100%;display:block'";
            class_title = "style='font-size: 14px; font-weight:bold;line-height:16px'";
            class_p = "style='font-size:12px;margin:0px;line-height:14px'";
            class_div_photos = "style='width:100%'";
            class_div_child = "style='width:100%; display:block; padding-left:10px'";
            class_title_child = "style='font-size: 12px; font-weight:bold;line-height:14px'";
            class_p_child = "style='font-size: 12px;line-height:14px'";
        }
        Object.keys(pdf_values_all_sorted).forEach(function(key_unique, index){
            Object.keys(pdf_values_all_sorted[key_unique]).forEach(function(id_field_father, index_father_field){
                var pdf_content = "";
                if(is_alert){
                    if(index>0){text_dnone=' invisible '}
                    pdf_content += "<div class='mt-3 "+text_dnone+" alert_mail_conteiner alert_mail_conteiner"+index+"'>"; 
                    grouped_mail = [];
                }
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
                if(is_alert){
                    pdf_content += "</div>";
                }
                $('#pdf_body').append(pdf_content);
                //cambiar modelo para que traiga fotos de un array de ids
                get_photo(pdf_values_all_sorted[key_unique][id_field_father]['ids'].unique()[0],true,index+"_"+index_father_field,true,is_alert);
            // Campos padres
                Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['fathers']).forEach(function(father_key){
                    var pdf_content = "<div class = '"+text_dnone+" div_pdf_child_container div_pdf_child_container"+index+"'>"
                    pdf_content += "<div class = 'div_pdf div_pdf_child div_pdf"+father_key+"_"+index+"_"+index_father_field+"' "+class_div_child+">";
                    pdf_content += "<p class='title_pdf mt-3 mb-1 element_pdf' "+class_p_child+">"+Navarra.dashboards.config.name_project+"</p>";
                    Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key]).forEach(function(key_f) {
                        pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' "+class_p_child+" >"+pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['name']+": "+pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['value']+"</p></div>";
                        if(is_alert && key_f == alert_mail_key){
                            grouped_mail.push(pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['value']);
                        }
                    });
                pdf_content += "</div>";
                pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+father_key+"_"+index+"_"+index_father_field+"' "+class_div_photos+"></div>"
                pdf_content += "</div>";
                $('#pdf_body').append(pdf_content);
                get_photo(father_key,false,father_key+"_"+index+"_"+index_father_field,true, is_alert);
                });
                if(is_alert && grouped_mail.length>0){
                    var option_mail = "<a onclick='Navarra.pdf.change_alert_mail("+index+")' class='dropdown-item text-left custom_cursor'>"+grouped_mail.unique()+"</a>"
                    $('#dropdown_alert_mails').append(option_mail);
                }
            });
        });
    }
    if(is_alert && $('#alert_group').val()!="suform_grouped" && $('#alert_group').val()!=""){
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
        console.log("Objeto ordenado")
        console.log(pdf_values_all_sorted);
        //Dibuja objeto ordenado
        Object.keys(pdf_values_all_sorted).forEach(function(object_grouped, index_sorted){
            grouped_mail = [];
            pdf_values_all_sorted[object_grouped]['objects'].forEach(function(pdf_object, index){
                create_htm_pdf(pdf_object,index_sorted, is_alert);
            });
            if(is_alert && grouped_mail.length>0){
                var option_mail = "<a onclick='Navarra.pdf.change_alert_mail("+index_sorted+")' class='dropdown-item text-left custom_cursor'>"+grouped_mail.unique()+"</a>"
                $('#dropdown_alert_mails').append(option_mail);
        }
        });
    }
    //agrega mapa
    if(!is_alert){
        var mapContainer = document.getElementById('map');
        $('.leaflet-top').addClass('d-none');
        html2canvas(mapContainer, {
            useCORS: true,
        }).then(function(canvas) {
             imgData_pdf = canvas.toDataURL(
                    'image/png');
            var new_map_pdf = document.createElement("IMG");
            new_map_pdf.src = imgData_pdf;
            new_map_pdf.style.width = '90%'
            new_map_pdf.style.marginTop = '20px';
            new_map_pdf.id = "map_pdf";
            $('#pdf_body').append(new_map_pdf);
            $('.leaflet-top').removeClass('d-none');
        });
    }
}

function create_htm_pdf(pdf_object,index_pdf, is_alert){
    var text_dnone = '';
    var alert_mail_key = $('#alert_mail').val();
    var pdf_content = "";
    var class_div = "";
    var class_title = "style='font-size:1.3vh'";
    var class_p = "style='font-size:1vh'";
    var class_div_photos = "";
    var class_div_child = "";
    var class_title_child = "style='font-size:1.1vh'";
    var class_p_child = "style='font-size:1.1vh'";
    if(is_alert){
        if(index_pdf>0){text_dnone=' invisible '}
        pdf_content += "<div class='mt-3 "+text_dnone+" alert_mail_conteiner alert_mail_conteiner"+index_pdf+"'>";   
        class_div = "style='width:100%;display:block'";
        class_title = "style='font-size: 14px; font-weight:bold;line-height:16px'";
        class_p = "style='font-size:12px;margin:0px;line-height:14px'";
        class_div_photos = "style='width:100%'";
        class_div_child = "style='width:100%; display:block; padding-left:10px'";
        class_title_child = "style='font-size: 12px; font-weight:bold;line-height:14px'";
        class_p_child = "style='font-size: 12px;line-height:14px'";
    }
    pdf_content += "<div class = 'div_pdf div_pdf"+pdf_object['id']+"' "+class_div+">";
    pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' "+class_title+">"+Navarra.dashboards.config.name_project+"</p>";
    Object.keys(pdf_object['properties']).forEach(function(key) {
        pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' "+class_p+" >"+pdf_object['properties'][key]['name']+": "+pdf_object['properties'][key]['value']+"</p></div>";
        if(is_alert && key == alert_mail_key){
            grouped_mail.push(pdf_object['properties'][key]['value']);
        }
    });
    pdf_content += "</div>"
    pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+pdf_object['id']+"' "+class_div_photos+"></div>"
    if(is_alert){
        pdf_content += "</div>"
    }
    $('#pdf_body').append(pdf_content);
    get_photo(pdf_object['id'],false,pdf_object['id'],false,is_alert);
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
        get_photo(child_key,true,child_key,false,is_alert);
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
                img_pdf += "<img alt='imagen' style='width: 20%; margin:2px; display: inline-block' src= 'data:image/png;base64,"+img_base64+"' />"
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
            } else{
                $('.logo_coorp_pdf_src').css('visibility','hidden');
                $('.logo_coorp_pdf_src').removeClass('element_pdf');
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

function save_pdf(){
    if(document.getElementById('map_pdf') == undefined){
        var text_toast = "Espere la imagen del mapa antes de guardar el pdf";
        $('#text_toast').html(text_toast);
        $('.toast').toast('show');
        return;   
    }
    $('#pdf-modal').modal('hide');
    var num_pages = 0;
    var y_screen = tamVentana()[1]*0.9;
    var x_screen = tamVentana()[1]*0.64;
    var y_page = 290;
    var x_page = 210;
    var y_proportion = y_page/y_screen;
    var x_proportion = x_page/x_screen;
    var altura = 0;
    var altura_final = 0;
    var margin_pdf = 10;
    var last_y = 0;
    const doc = new jsPDF({
    orientation: 'p',
    format: 'a4'
    });
    doc.setFontSize(7);
    doc.setTextColor(84, 84, 84);
    doc.text("powerd by",176,20);
    doc.setTextColor(0, 0, 0);
    var logo_gw = new Image()
    logo_gw.src = $('#img_logo_gw').attr('src');
    doc.addImage(logo_gw, 'PNG', 165, 20 , 29, 9);
    var height_line = $('.pdf_header').outerHeight() * y_proportion + 10;
    doc.line(10,height_line,200,height_line); 
    var element_pdf = $('.element_pdf');
    element_pdf.each(function(index){
        var x_pdf = this.offsetLeft * x_proportion;
        var y_pdf = this.offsetTop * y_proportion;
        if(last_y != y_pdf){
            if(altura>(y_page - 20)) {
                num_pages ++;
                doc.addPage();
                margin_pdf += 30;
            }
        }
        last_y = y_pdf;
        altura = y_pdf - (y_page * num_pages) + margin_pdf;
        var font_size_pdf = parseFloat(this.style.fontSize)*9;
        doc.setFontSize(font_size_pdf);
        if(this.nodeName==='P'){
            var width_pdf = this.parentNode.offsetWidth * x_proportion;
            var longtext = this.innerHTML;
            var splitTitle = doc.splitTextToSize(longtext, width_pdf);
            doc.text(x_pdf , altura, splitTitle);
            altura_final = altura;
        }
        
        if(this.nodeName==='IMG'){
            var width_pdf = this.offsetWidth * x_proportion;
            var height_pdf = this.offsetHeight * y_proportion;
            doc.addImage(this.src, 'JPEG', x_pdf , (altura - 2) , width_pdf, height_pdf);
            if(altura_final < (altura + height_pdf ) ){
                altura_final = altura + height_pdf;
            }
        }        
 });
    // imprime mapa
    var width_map_pdf = document.getElementById('map_pdf').offsetWidth * x_proportion;
    var height_map_pdf = document.getElementById('map_pdf').offsetHeight * y_proportion;
    if(altura_final + (190 * height_map_pdf/width_map_pdf)>(y_page - 20)) {
        num_pages ++;
        doc.addPage();
        margin_pdf += 30;
        altura_final = 10;
    }
    doc.addImage(imgData_pdf, 'PNG', 10, (altura_final + 10), 190 , 190 * height_map_pdf/width_map_pdf)
    doc.save("reporte.pdf");
}

function send_alerts(){
    $('.alert_to').each(function(){
        $(this).click();
        var alert_to = $(this).html();
        var alert_mail_content = '<img style="width:200px" src="cid:logo.png"/>'
        var alert_mail_content = '<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="border: 5px solid #d4dadf;border-radius: 20px;">';
        alert_mail_content +='<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" style="padding: 30px 24px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; font-size:20px; line-height: 20px; color: #666;">'
        alert_mail_content += $('.alert_header').html();
        alert_mail_content += '</td></tr></table>';
        alert_mail_content += '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="left" valign="top" style="padding: 0px 10px 24px 10px; font-family: \'Source Sans Pro\', Helvetica, Arial, sans-serif; color: #666; line-height: 24px;">'
        // clonamos el body y eliminamos los divs ocultos
        var body_clone = $('#pdf_body').clone();
        body_clone.attr('id','body_clone');
        $("#canvas_alert").empty();
        $("#canvas_alert").append(body_clone);
        $('#body_clone').find('div.d-none').remove();
        alert_mail_content += $('#body_clone').html();
        $("#canvas_alert").empty();
        alert_mail_content += '</td></tr></table>';
        alert_mail_content += '</td></tr></table>';
        var plain_content = $('#alert_text').val();
        $.ajax({
            url: '/table_configurations/send_alerts',
            type: 'POST',
            data: {
                to: alert_to,
                name_corp: Navarra.dashboards.config.current_tenement,
                html_content: alert_mail_content,
                plain_content: plain_content
            }
        });
    })
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
   console.log(img.width)
   canvas.height = img.height;
   ctx.drawImage(img, 0, 0 , img.width, img.height);
   return canvas.toDataURL('image/png');
}

return {
    init: init,
    save_pdf: save_pdf,
    change_alert_mail: change_alert_mail,
    send_alerts: send_alerts
}
}();
