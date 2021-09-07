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
                    if(index_column>2 && this.innerHTML!='' && this.style.display!='none'){
                        var column_name = $('#tr_visible th:nth-child('+(index_column+1)+')')[0];
                        var column_key = $('#tr_visible th:nth-child('+(index_column+1)+') input')[0];
                        pdf_values['properties'][column_key.value]= new Object;
                        pdf_values['properties'][column_key.value]['value'] = this.innerHTML;
                        pdf_values['properties'][column_key.value]['name'] = column_name['id'].split("columnfake_")[1];
                    }
                    });
                row_selected_child = $('#table_visible tr:nth-child('+index+') .custom_row_child tr');
                    row_selected_child.each(function(){
                        console.log("ROW selected!!!!")
                        console.log(this)
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
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json] =  new Object;
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json]['value'] = this.innerHTML;
                                    pdf_values['children'][id_child_json]['properties'][id_father_field_json]['name'] = column_child_name;
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
    pdf_values_all.forEach(function(pdf_object){
        var pdf_content = "<div class = 'div_pdf div_pdf"+pdf_object['id']+"'>";
        pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' style='font-size:0.7em'>"+Navarra.dashboards.config.name_project+"</p>";
        Object.keys(pdf_object['properties']).forEach(function(key) {
            pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' style='font-size:0.5em' >"+pdf_object['properties'][key]['name']+": </p>";
            pdf_content += "<p class='p_pdf element_pdf' style='font-size:0.5em'>"+pdf_object['properties'][key]['value']+"</p></div>";
        });
        pdf_content += "</div>"
        pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+pdf_object['id']+"'></div>"
        $('#pdf_body').append(pdf_content);
        get_photo(pdf_object['id'],false);
        // Campos hijos
        Object.keys(pdf_object['children']).forEach(function(child_key){
            var pdf_content = "<div class = 'div_pdf div_pdf_child div_pdf_child"+child_key+"'>";
            pdf_content += "<p class='title_pdf mt-3 mb-0 element_pdf' style='font-size:0.6em'>"+pdf_object['children'][child_key]['name_field']+": "+pdf_object['children'][child_key]['date']+"</p>";
            Object.keys(pdf_object['children'][child_key]['properties']).forEach(function(key_c) {
                pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf element_pdf' style='font-size:0.5em' >"+pdf_object['children'][child_key]['properties'][key_c]['name']+": </p>";
                pdf_content += "<p class='p_pdf element_pdf' style='font-size:0.5em'>"+pdf_object['children'][child_key]['properties'][key_c]['value']+"</p></div>";
            });
            pdf_content += "</div>"
            pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos_child"+child_key+"'></div>"
            $('#pdf_body').append(pdf_content);
            get_photo(child_key,true);
        })
    });
}

function get_photo(app_id, ischild){
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
                if($('.'+container+app_id).outerHeight()>55){
                    $('.'+container+app_id).removeClass('div_pdf');
                    $('.'+container+app_id).addClass('div_pdf_expanded');
                    $('.'+container+app_id+' div').addClass('d-inline-flex');
                    $('.'+container+app_id+' div').addClass('sub_div_pdf_expanded');
                    $('.'+container+app_id+' div').removeClass('d-flex');
                } else{
                    $('.'+container+app_id).addClass('w-100');
                }
            } else{
                var img_pdf = "<div class='pt-4'>";
                var height_container = $('.'+container+app_id).outerHeight() - 30;
                var width_container = $('.'+container+app_id).outerWidth()
                if(height_container*data.length + 4*data.length > width_container){
                    height_container = ($('.'+container+app_id).outerWidth() / data.length) - 4;
                }
                data.forEach(function(photo){
                    img_pdf += "<img style='height: "+height_container+"px' src= 'data:image/png;base64,"+photo.image+"' class='img_pdf element_pdf'/>"
                });
                img_pdf +="</div>"
                $('.'+container_photos+app_id).removeClass('d-none');
                $('.'+container_photos+app_id).append(img_pdf)
            }
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
    var margin_pdf = 20;
    var last_y = 0;
    const doc = new jsPDF({
    orientation: 'p',
    format: 'a4'
    });
    var element_pdf = $('.element_pdf');
    element_pdf.each(function(index){
        var x_pdf = this.offsetLeft * x_proportion;
        var y_pdf = this.offsetTop * y_proportion;
        if(last_y != y_pdf){
            if(altura>(y_page - 20)) {
                num_pages ++;
                doc.addPage();
                margin_pdf += 20;
            }
        }
        last_y = y_pdf;
        altura = y_pdf - (y_page * num_pages) + margin_pdf;
        var font_size_pdf = parseFloat(this.style.fontSize)*12/0.6;
        doc.setFontSize(font_size_pdf);
        if(this.nodeName==='P'){
            doc.text(this.innerHTML, x_pdf, altura);
        }
        
        if(this.nodeName==='INPUT'){
            doc.text(this.value, x_pdf , altura);
        }
        if(this.nodeName==='IMG'){
            var width_pdf = this.offsetWidth * x_proportion;
            var height_pdf = this.offsetHeight * y_proportion;
            doc.addImage(this.src, 'JPEG', x_pdf , altura , width_pdf, height_pdf);
        }
        
 });
    doc.save("two-by-four.pdf");
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
    save_pdf: save_pdf
}
}();
