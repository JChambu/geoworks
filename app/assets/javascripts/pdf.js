Navarra.namespace("pdf");
Navarra.pdf = function() {
var pdf_values_all = [];

function init() {
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
                       // pdf_values['properties'][column_key.value]['name'] = column_name.getAttribute('key_name');
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
    create_pdf_view();
}

function create_pdf_view(){
    $('#pdf_body').empty();
    get_logo();
    if(!$('#set_subfield_grouped').hasClass('grouped')){
        // Ordenado por geometría
        pdf_values_all.forEach(function(pdf_object){
            var pdf_content = "<div class = 'div_pdf div_pdf"+pdf_object['id']+"'>";
            pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' style='font-size:0.7em'>"+Navarra.dashboards.config.name_project+"</p>";
            Object.keys(pdf_object['properties']).forEach(function(key) {
                pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' style='font-size:0.5em' >"+pdf_object['properties'][key]['name']+": "+pdf_object['properties'][key]['value']+"</p></div>";
            });
            pdf_content += "</div>"
            pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+pdf_object['id']+"'></div>"
            $('#pdf_body').append(pdf_content);
            get_photo(pdf_object['id'],false,pdf_object['id'],false);
            // Campos hijos
            Object.keys(pdf_object['children']).forEach(function(child_key){
                var pdf_content = "<div class = 'div_pdf div_pdf_child div_pdf_child"+child_key+"'>";
                pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' style='font-size:0.6em'>"+pdf_object['children'][child_key]['name_field']+": "+pdf_object['children'][child_key]['date']+"</p>";
                Object.keys(pdf_object['children'][child_key]['properties']).forEach(function(key_c) {
                    pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' style='font-size:0.5em' >"+pdf_object['children'][child_key]['properties'][key_c]['name']+": "+pdf_object['children'][child_key]['properties'][key_c]['value']+"</p></div>";
                });
                pdf_content += "</div>"
                pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos_child"+child_key+"'></div>"
                $('#pdf_body').append(pdf_content);
                get_photo(child_key,true,child_key,false);
            })
        });
    } else {
        //Ordenado por indicador único de hijos
        //Crea objeto ordenado
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
        Object.keys(pdf_values_all_sorted).forEach(function(key_unique, index){
            Object.keys(pdf_values_all_sorted[key_unique]).forEach(function(id_field_father, index_father_field){
                var pdf_content = "<div class = 'div_pdf div_pdf_child"+index+"_"+index_father_field+"'>";
                pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' style='font-size:0.7em'>"+pdf_values_all_sorted[key_unique][id_field_father]['child']['name_field']+"</p>";
                if(pdf_values_all_sorted[key_unique][id_field_father]['unique_id']!=undefined){
                    pdf_content += "<p class='title_pdf mt-1 mb-0 element_pdf' style='font-size:0.7em'>"+pdf_values_all_sorted[key_unique][id_field_father]['unique_id']+"</p>";    
                }
                pdf_content += "<p class='title_pdf mt-1 mb-1 element_pdf' style='font-size:0.7em'>"+pdf_values_all_sorted[key_unique][id_field_father]['child']['date']+"</p>";
                Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['child']['properties']).forEach(function(key) {
                    pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' style='font-size:0.5em' >"+pdf_values_all_sorted[key_unique][id_field_father]['child']['properties'][key]['name']+": "+pdf_values_all_sorted[key_unique][id_field_father]['child']['properties'][key]['value']+"</p></div>";
                });
                pdf_content += "</div>"
                pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos_child"+index+"_"+index_father_field+"'></div>"
                $('#pdf_body').append(pdf_content);
                //cambiar modelo para que traiga fotos de un array de ids
                get_photo(pdf_values_all_sorted[key_unique][id_field_father]['ids'].unique()[0],true,index+"_"+index_father_field,true);
            // Campos padres
                Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['fathers']).forEach(function(father_key){
                    var pdf_content = "<div class = 'div_pdf div_pdf_child div_pdf"+father_key+"_"+index+"_"+index_father_field+"'>";
                    pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' style='font-size:0.6em'>"+Navarra.dashboards.config.name_project+"</p>";
                    Object.keys(pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key]).forEach(function(key_f) {
                        pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' style='font-size:0.5em' >"+pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['name']+": "+pdf_values_all_sorted[key_unique][id_field_father]['fathers'][father_key][key_f]['value']+"</p></div>";
                    });
                pdf_content += "</div>"
                pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+father_key+"_"+index+"_"+index_father_field+"'></div>"
                $('#pdf_body').append(pdf_content);
                get_photo(father_key,false,father_key+"_"+index+"_"+index_father_field,true);
                })
            });
        });
    }
}

function get_photo(app_id, ischild, id_container,is_grouped){
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
                data.forEach(function(photo){
                    img_pdf += "<img style='height: "+height_container+"px' src= 'data:image/png;base64,"+photo.image+"' class='img_pdf element_pdf'/>"
                });
                img_pdf +="</div>"
                $('.'+container_photos+id_container).removeClass('d-none');
                $('.'+container_photos+id_container).append(img_pdf)
            }
        }
    });
}

function get_logo(){
    $.ajax({
        type: 'GET',
        url: '/customers/search_customer',
        datatype: 'JSON',
        data: {
            current_tenement: Navarra.dashboards.config.current_tenement
        },
        success: function(data) {
            $('#logo_coorp_pdf').attr("src",'data:image/png;base64,'+data.logo);
            var currentdate = new Date(); 
            var today = currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/"  + currentdate.getFullYear() ;
            $('#pdf_created').html(data.username+" - "+today);
        },
        error: function( jqXHR, textStatus, errorThrown ) {
        }
    });
}

function save_pdf(){
    var num_pages = 0;
    var y_screen = tamVentana()[1]*0.9;
    var x_screen = tamVentana()[1]*0.64;
    var y_page = 290;
    var x_page = 210;
    var y_proportion = y_page/y_screen;
    var x_proportion = x_page/x_screen;
    var altura = 0;
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
    logo_gw.src = '/assets/logo_gw_hor_2.png';
    doc.addImage(logo_gw, 'PNG', 165, 20 , 29, 9);
    var height_line = $('.pdf_header').outerHeight() * y_proportion + 14;
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
        var font_size_pdf = parseFloat(this.style.fontSize)*12/0.6;
        doc.setFontSize(font_size_pdf);
        if(this.nodeName==='P'){
            var width_pdf = this.offsetWidth * x_proportion;
            var longtext = this.innerHTML;
            var splitTitle = doc.splitTextToSize(longtext, width_pdf);
            doc.text(x_pdf , altura, splitTitle);
        }
        
        if(this.nodeName==='INPUT'){
            doc.text(this.value, x_pdf , altura);
        }
        if(this.nodeName==='IMG'){
            var width_pdf = this.offsetWidth * x_proportion;
            var height_pdf = this.offsetHeight * y_proportion;
            doc.addImage(this.src, 'JPEG', x_pdf , (altura - 2) , width_pdf, height_pdf);
        }
        
 });
    doc.save("reporte.pdf");
}

function set_subfield_grouped(){
    if($('#set_subfield_grouped').hasClass('grouped')){
        $('#set_subfield_grouped').removeClass('grouped');
        $('#set_subfield_grouped').removeClass('icon_selected');
    } else {
        $('#set_subfield_grouped').addClass('grouped');
        $('#set_subfield_grouped').addClass('icon_selected');
    }
    create_pdf_view();
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

return {
    init: init,
    save_pdf: save_pdf,
    set_subfield_grouped: set_subfield_grouped
}
}();
