Navarra.namespace("pdf");
Navarra.pdf = function() {
var pdf_values_all = [];

function init() {
    var table_check = $('#table_visible .custom-control-input'); 
    table_check.each(function(index){
        if(this.checked){
            var pdf_values = new Object;
            pdf_values['id'] = this.id.split("check_select_")[1];
            pdf_values['properties'] = new Object;
            var row_selected = $('#table_visible tr:nth-child('+index+') td').not('.custom_row_child').not('.child_celd');
            row_selected.each(function(index_column){
                console.log(this)
                if(index_column>2 && this.innerHTML!='' && this.style.display!='none'){
                    var column_name = $('#tr_visible th:nth-child('+(index_column+1)+')')[0];
                    var column_key = $('#tr_visible th:nth-child('+(index_column+1)+') input')[0];
                    pdf_values['properties'][column_key.value]= new Object;
                    pdf_values['properties'][column_key.value]['value'] = this.innerHTML;
                    pdf_values['properties'][column_key.value]['name'] = column_name['id'].split("columnfake_")[1];
                }
            });
            console.log("Objeto")
            console.log(pdf_values);
            pdf_values_all.push(pdf_values);
        }
    });
    console.log("Array de datos")
    console.log(pdf_values_all)
    create_pdf_view();
}

function create_pdf_view(){
    pdf_values_all.forEach(function(pdf_object){
        var pdf_content = "<div class = 'div_pdf div_pdf"+pdf_object['id']+"'>";
        pdf_content += "<p class='title_pdf mt-3 mb-0'>"+Navarra.dashboards.config.name_project+"</p>";
        Object.keys(pdf_object['properties']).forEach(function(key) {
            pdf_content += "<div class='m-0 ml-2 d-flex'> <p class='p_pdf'>"+pdf_object['properties'][key]['name']+": </p>";
            pdf_content += "<p class='p_pdf'>"+pdf_object['properties'][key]['value']+"</p></div>";
        });
        pdf_content += "</div>"
        pdf_content += "<div class='d-none div_pdf_photos div_pdf_photos"+pdf_object['id']+"'></div>"
        $('#pdf_body').append(pdf_content);
        get_photo(pdf_object['id'],false)
    });
}

function get_photo(app_id, ischild){
    if(ischild){
        var url_get = '/photos_children/show_photos_children';
        var data_get = {
            project_data_child_id: app_id,
        }
    } else{
        var url_get = '/photos/show_photos';
        var data_get = {
            project_id: app_id,
        }
    }
    console.log(data_get)
   $.ajax({
        type: 'GET',
        url: url_get,
        datatype: 'json',
        data: data_get,
        success: function(data) {
            if(data.length==0){
                $('.div_pdf'+app_id).removeClass('div_pdf');
                $('.div_pdf'+app_id).addClass('div_pdf_expanded');
                $('.div_pdf'+app_id+' div').addClass('d-inline-flex');
                $('.div_pdf'+app_id+' div').addClass('sub_div_pdf_expanded');
                $('.div_pdf'+app_id+' div').removeClass('d-flex');
            } else{
                if(data.length==1){var one_img = "w-100 "} else{var one_img = ""}
                var img_pdf = "<div class='pt-4'>";
                data.forEach(function(photo){
                    img_pdf += "<img src= 'data:image/png;base64,"+photo.image+"' class='"+one_img+"img_pdf'/>"
                });
                img_pdf +="</div>"
                $('.div_pdf_photos'+app_id).removeClass('d-none');
                $('.div_pdf_photos'+app_id).append(img_pdf)
            }
        }
    });
}

return {
    init: init,
}
}();
