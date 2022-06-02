Navarra.namespace("excel");
Navarra.excel = function() {


table_to_excel_api = function (){
	$('#text_toast').html("Generando Reporte. En breve se descargará su archivo.");
  $('#toast').toast('show');
	var headers = [];
	var headers_width_subfields = [];
	//busca cabeceras
	$('#tr_visible').find($('.header_column').not('.d-none')).each(function(){
		new_header = {
			name: $(this).find('p').html()
		}
		//busca subcabeceras
		var new_empty_all = [];
		if($(this).hasClass('subheader_column')){
			new_header['subheaders'] = [];
			id_subfield = $(this).attr('id').split('header_column_')[1];
			headers_width_subfields.push(id_subfield);
			$('#tr_subfields').find($('.subfield_column_'+id_subfield).not('.d-none')).each(function(i){
				var sub_text = "";
				if(i==0){
					sub_text = $(this).html();
				} else{
					sub_text = $(this).find('p').html();
					// agrega celdas vacía a la cabecera principal
					new_empty = {}
					new_empty['name'] = "";
					new_empty["subheaders"] = [""];
					new_empty["empty"] = "true";
					new_empty_all.push(new_empty);
				}
				new_header['subheaders'].push(sub_text);
			});
		}
		headers.push(new_header);
		new_empty_all.forEach(function(ne){
			headers.push(ne);
		});
	});
	headers_width_subfields.unique();
	var body = [];
	$('.row_data').each(function(){
		var new_row = {};
		new_row['properties'] = [];
		var id_row = $(this).attr('id').split('row_table_data')[1];
		// agrega celdas capas
		$('.celdlayer_id'+id_row).not('.d-none').each(function(){
			var multi_celd = "";
			$(this).find('div').each(function(i){
				if(i != 0){
					multi_celd += " - ";
				}
				multi_celd += $(this).html();
			});
			new_row['properties'].push(multi_celd);
		});
		//agrega celdas
		$('.celd_id'+id_row).not('.action_celd').not('.d-none').each(function(){
			new_row['properties'].push($(this).html());
		});
		//agrega celdas hijos
		if(!$('#tr_subfields').hasClass('d-none')){
			var new_sub = {}
			var has_data_subfield = false;
			// Calcula el máximo de hijos que tiene cada subformulario para el actual row
			var max_child = 0;
			headers_width_subfields.forEach(function(sub){
				count = 0;
				$('.celdsubform_date_id'+id_row).each(function(){
					if($(this).attr('id').split('_')[0] == sub ){
						count ++;
					}
				});
				if(count>max_child){max_child=count}
			});
			headers_width_subfields.forEach(function(sub){
				var index_child = 0;
				$('.celdsubform_date_id'+id_row).each(function(){
					if($(this).attr('id').split('_')[0] == sub ){
						index_child ++;
						if(new_sub[index_child] == undefined){
							new_sub[index_child] = [];	
						}
						new_sub[index_child].push($(this).html());
						has_data_subfield = true;
						var id_field_father = $(this).attr('id').split('_')[0];
						var id_child = $(this).attr('id').split('_')[2];
						$("[id_child="+id_child+"]").not('.d-none').not('.just_date').each(function(){
							new_sub[index_child].push($(this).html());
						});
					}
				});
				//rellena con valores vacíos
				empty_celds = $('#tr_subfields').find($('.subfield_column_'+sub).not('.d-none')).length;
				for(x=1;x<=(max_child - index_child);x++){
					if(new_sub[x+index_child] == undefined){
						new_sub[x+index_child] = [];
					}
					for(y=0;y<empty_celds;y++){
						new_sub[x+index_child].push("");
					}
				}
			});
			if(has_data_subfield){
				new_row['subproperties'] = [];
				Object.keys(new_sub).forEach(function(k){
					var ob = {}
					ob[k] = new_sub[k];
					new_row['subproperties'].push(ob);
				})
			}
		}
		body.push(new_row);
	});
	excel_data =[];
	var new_h = {}
	new_h['headers'] = headers;
	new_h['body'] = body;
	excel_data.push(new_h);
	data_report ={}
    data_report["data"] = excel_data;
    data_report["name"] = Navarra.dashboards.config.name_project;
    var hash_pdf = {}
    hash_pdf["name"] = "excel_rep";
    var data = {}
    data["template"] = hash_pdf;
    data["data"] = JSON.stringify(data_report);

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
        a.attr("download", "tabla.xlsx");
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);
      }
  });
}

return {
    table_to_excel_api: table_to_excel_api
}
}();
